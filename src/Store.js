import { action, extendObservable, toJS } from "mobx";
import { KINTO_URL } from "./Config";
import Kinto from "kinto";

// configure({ enforceActions: true });

// We don't do the automatic periodic background sync if it was
// recently done (due to user action).
const MIN_LAST_SYNC_AGE_MS = 2 * 1000;
const KEEP_SYNCING_INTERVAL_MS = 10 * 1000;

const MAX_SYNCLOGS_TO_KEEP = 30;

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
      keepSyncing: action(() => {
        this.periodicSyncTimer = setTimeout(() => {
          let lastAnything = 0;
          if (this.syncLog.lastFailure) {
            lastAnything = this.syncLog.lastFailure;
          }
          if (
            this.syncLog.lastSuccess &&
            this.syncLog.lastSuccess > lastAnything
          ) {
            lastAnything = this.syncLog.lastSuccess;
          }
          const lastSyncAge = new Date().getTime() - lastAnything;
          // The only reason NOT to sync is if it was done recently.
          if (lastSyncAge > MIN_LAST_SYNC_AGE_MS) {
            this.sync();
          } else {
            console.warn(
              "Skipping periodic sync because it was done recently."
            );
          }
          this.keepSyncing();
        }, KEEP_SYNCING_INTERVAL_MS);
      }),
      sync: action(() => {
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
            console.log("DATA:", data);
            if (data.ok) {
              this.syncLog.lastSuccess = new Date().getTime();
            } else {
              this.syncLog.lastFailure = new Date().getTime();
            }
            data._date = new Date();
            this.syncLogs.push(data);
            if (this.syncLogs.length >= MAX_SYNCLOGS_TO_KEEP) {
              // Need to slice it down.
              this.syncLogs = this.syncLogs.slice(
                this.syncLogs.length - MAX_SYNCLOGS_TO_KEEP,
                this.syncLogs.length
              );
            }

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
                  throw err;
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
      updateItem: action((item, text, notes, context) => {
        const thisItemIndex = this.items.findIndex(i => i.id === item.id);
        const thisItem = this.items[thisItemIndex];
        thisItem.text = text;
        thisItem.notes = notes;
        thisItem.context = context;
        thisItem.modified = new Date().getTime();
        this.items[thisItemIndex] = thisItem;
        this.collection
          .update(this.cleanBeforeUpdating(thisItem))
          .catch(err => {
            throw err;
          })
          .then(() => {
            this.sync();
          });
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
          .update(this.cleanBeforeUpdating(thisItem))
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
          .update(this.cleanBeforeUpdating(thisItem))
          .then(() => {
            this.sync();
          })
          .catch(err => {
            throw err;
          });
      }),
      togglePinnedItem: action(item => {
        const thisItemIndex = this.items.findIndex(i => i.id === item.id);
        const thisItem = this.items[thisItemIndex];
        if (thisItem.pinned) {
          thisItem.pinned = null;
        } else {
          thisItem.pinned = new Date().getTime();
        }
        this.items[thisItemIndex] = thisItem;
        this.collection
          .update(this.cleanBeforeUpdating(thisItem))
          .then(() => {
            this.sync();
          })
          .catch(err => {
            throw err;
          });
      }),
      cleanBeforeUpdating: item => {
        const plain = toJS(item);
        if (plain.last_modified) {
          delete plain.last_modified;
        }
        return plain;
      },
      cleanSlate: action(() => {
        // Mark all that are NOT hidden as hidden now.
        const now = new Date().getTime();
        this.items.forEach(item => {
          if (!item.hidden && !item.pinned) {
            item.hidden = now;
            this.collection
              .update(this.cleanBeforeUpdating(item))
              .catch(err => {
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
            this.collection
              .update(this.cleanBeforeUpdating(item))
              .catch(err => {
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
