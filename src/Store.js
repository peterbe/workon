import { action, extendObservable } from "mobx";
import { KINTO_URL } from "./Config";
import Kinto from "kinto";

// configure({ enforceActions: true });

class TodoStore {
  constructor(rootStore) {
    this.rootStore = rootStore;

    // this.db = new Kinto();
    this.db = new Kinto({
      adapterOptions: {
        // Going from Kinto.js 11 to 12
        migrateOldData: true
      }
    });
    this.collection = this.db.collection("todos");

    extendObservable(this, {
      items: [],
      deletedItem: null,
      editItem: null,
      cleanSlateDate: null,
      accessToken: null,
      contextFilter: null,
      syncLog: {
        error: null,
        lastSuccess: null,
        lastFailure: null
      },
      syncLogs: [],
      obtain: action(() => {
        return this.collection.list({ order: "-created" }).then(res => {
          this.items = res.data;
        });
      }),
      sync: action(() => {
        // localStorage.setItem("items", JSON.stringify(this.items));
        if (!this.accessToken) {
          console.warn("No accessToken, no remote sync.");
          return;
        }
        const syncOptions = {
          remote: KINTO_URL,
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        };

        this.collection
          .sync(syncOptions)
          .then(data => {
            if (data.ok) {
              this.syncLog.lastSuccess = new Date().getTime();
            } else {
              this.syncLog.lastFailure = new Date().getTime();
            }
            data._date = new Date();
            this.syncLogs.push(data);

            if (data.conflicts.length) {
              console.warn(`There are ${data.conflicts.length} conflicts.`);
              return Promise.all(
                data.conflicts.map(conflict => {
                  return this.collection.resolve(conflict, conflict.remote);
                })
              )
                .then(() => {
                  console.log("Conflicts successfully resolved.");
                  this.collection
                    .sync(syncOptions)
                    .then(() => {
                      console.log(
                        "Server sync successful after conflict resolution."
                      );
                    })
                    .catch(err => {
                      console.log("Server sync failed.", err);
                    });
                })
                .catch(err => {
                  console.warn("Attempt to resolve all conflicts failed.", err);
                });
            }
          })
          .catch(error => {
            console.warn("ERROR:", error);
            if (
              error.message.includes(
                "Data provided to an operation does not meet requirements."
              )
            ) {
              // XXX Debugging for https://github.com/peterbe/workon/issues/6
              throw error;
            }

            if (error.message.includes("flushed")) {
              return this.collection.resetSyncStatus().then(_ => {
                this.collection.sync();
                alert("Server data flushed. Trying to refresh this page.");
                window.location.reload();
              });
            }
            if (error.data && error.data.code && error.data.code === 401) {
              // The access token is out-of-date
              this.accessToken = null;
            }
            this.syncLog.error = error;
            this.syncLog.lastFailure = new Date().getTime();
          });
      }),
      selfDestruct: action(() => {
        // XXX perhaps ask the user if all the remote
        this.collection
          .clear()
          .then(() => {
            this.items = [];
            this.editItem = null;
            this.deleteItem = null;
            this.sync();
            alert("It's all gone.");
          })
          .catch(err => {
            throw err;
          });
      }),
      editItemText: action((item, text, notes) => {
        const thisItemIndex = this.items.findIndex(i => i.id === item.id);
        const thisItem = this.items[thisItemIndex];
        thisItem.text = text;
        thisItem.notes = notes;
        thisItem.modified = new Date().getTime();
        this.items[thisItemIndex] = thisItem;
        this.collection.update(thisItem).catch(err => {
          throw err;
        });
        this.sync();
      }),
      editItemContext: action((item, context) => {
        const thisItemIndex = this.items.findIndex(i => i.id === item.id);
        const thisItem = this.items[thisItemIndex];
        thisItem.context = context;
        this.items[thisItemIndex] = thisItem;
        this.collection.update(thisItem).catch(err => {
          throw err;
        });
        this.sync();
        // XXX opportunity to update list of all contexts
      }),
      addItem: action(text => {
        const now = new Date();
        const item = {
          text,
          done: null,
          created: now.getTime(),
          modified: now.getTime()
          // id: newId
        };
        this.collection
          .create(item)
          .then(res => {
            item.id = res.data.id;
            this.items.unshift(item);
            this.sync();
          })
          .catch(err => {
            throw err;
          });
      }),
      importItem: action(item => {
        this.collection
          .create(item)
          .then(res => {
            item.id = res.data.id;
            this.items.unshift(item);
            // this.sync();
          })
          .catch(err => {
            throw err;
          });
      }),
      deleteItem: action(item => {
        this.editItem = null;
        const thisItemIndex = this.items.findIndex(i => i.id === item.id);
        const thisItem = this.items[thisItemIndex];
        if (thisItem.deleted) {
          thisItem.deleted = null;
          this.deletedItem = null;
        } else {
          thisItem.deleted = new Date().getTime();
          this.deletedItem = item;
        }
        this.collection
          .update(thisItem)
          .then(res => {
            this.items[thisItemIndex] = thisItem;
            this.sync();
          })
          .catch(err => {
            throw err;
          });
      }),
      doneItem: action(item => {
        const thisItemIndex = this.items.findIndex(i => i.id === item.id);
        const thisItem = this.items[thisItemIndex];
        if (thisItem.done) {
          thisItem.done = null;
        } else {
          thisItem.done = new Date().getTime();
        }
        this.items[thisItemIndex] = thisItem;
        this.editItem = null;
        this.collection
          .update(thisItem)
          .then(() => {
            this.sync();
          })
          .catch(err => {
            throw err;
          });
      }),
      cleanSlate: action(() => {
        // Mark all that are NOT hidden as hidden now.
        const now = new Date().getTime();
        this.items.forEach(item => {
          if (!item.hidden) {
            item.hidden = now;
            this.collection.update(item).catch(err => {
              throw err;
            });
          }
        });
        this.cleanSlateDate = now;
        this.sync();
      }),
      undoCleanSlate: action(() => {
        this.items.forEach(item => {
          if (
            item.hidden &&
            ((this.cleanSlateDate && item.hidden === this.cleanSlateDate) ||
              (!this.cleanSlateDate && item.hidden))
          ) {
            item.hidden = null;
            this.collection.update(item).catch(err => {
              throw err;
            });
          }
        });
        this.cleanSlateDate = null;
        this.sync();
      }),
      get allContextOptions() {
        const all = {};
        this.items.forEach(item => {
          const context = item.context ? item.context : "";
          if (!all[context]) {
            all[context] = 0;
          }
          all[context]++;
        });

        return Object.entries(all)
          .map(([key, value]) => {
            return { name: key, count: value };
          })
          .sort((a, b) => {
            if (a.name > b.name) return 1;
            if (b.name > a.name) return -1;
            return 0;
          });
      }
      // showAllHidden: action(() => {
      //   this.items.forEach(item => {
      //     if (item.hidden) {
      //       item.hidden = null;
      //       this.collection.update(item).catch(err => {
      //         throw err;
      //       });
      //     }
      //   });
      //   this.cleanSlateDate = null;
      //   this.sync();
      // })
    });
  }
}

class UserStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    extendObservable(this, {
      userInfo: null,
      serverError: null
    });
  }
}

class RootStore {
  constructor() {
    this.user = new UserStore(this);
    this.todos = new TodoStore(this);
  }
}
// import { decorate, observable } from "mobx"

const store = (window.store = new RootStore());
// const store = (window.store = new TodoStore());

export default store;
