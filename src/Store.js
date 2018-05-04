import { action, extendObservable } from "mobx";

// configure({ enforceActions: true });

class TodoStore {
  constructor(rootStore) {
    this.rootStore = rootStore;

    extendObservable(this, {
      items: [],
      deletedItem: null,
      editItem: null,
      cleanSlateDate: null,
      obtain: action(() => {
        const items = JSON.parse(localStorage.getItem("items") || "[]");
        if (items.length) {
          this.items = items;
        }
        this.items.replace(this.items.sort((a, b) => b.created - a.created));
      }),
      persist: action(() => {
        localStorage.setItem("items", JSON.stringify(this.items));
      }),
      editItemText: action((text, notes, item) => {
        const thisItemIndex = this.items.findIndex(i => i.id === item.id);
        const thisItem = this.items[thisItemIndex];
        thisItem.text = text;
        thisItem.notes = notes;
        thisItem.modified = new Date().getTime();
        this.items[thisItemIndex] = thisItem;
        this.persist();
      }),
      addItem: action(text => {
        const previousIds = this.items.map(item => item.id);
        let nextId = 1;
        if (previousIds.length) {
          nextId = Math.max(...previousIds) + 1;
        }
        const now = new Date();
        this.items.unshift({
          text,
          done: null,
          created: now.getTime(),
          modified: now.getTime(),
          id: nextId
        });
        this.persist();
      }),
      deleteItem: action(item => {
        this.deletedItem = item;
        this.editItem = null;
        this.items.remove(item);
        this.persist();
      }),
      undoDelete: action(() => {
        this.items.push(this.deletedItem);
        this.items.replace(this.items.sort((a, b) => b.created - a.created));
        this.deletedItem = null;
        this.persist();
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
        this.persist();
      }),
      cleanSlate: action(() => {
        // Mark all that are NOT hidden as hidden now.
        const now = new Date().getTime();
        this.items.forEach(item => {
          if (!item.hidden) {
            item.hidden = now;
          }
        });
        this.cleanSlateDate = now;
        this.persist();
      }),
      undoCleanSlate: action(() => {
        this.items.forEach(item => {
          if (item.hidden && item.hidden === store.cleanSlateDate) {
            item.hidden = null;
          }
        });
        this.cleanSlateDate = null;
        this.persist();
      }),
      showAllHidden: action(() => {
        this.items.forEach(item => {
          if (item.hidden) {
            item.hidden = null;
          }
        });
        this.cleanSlateDate = null;
        this.persist();
      })
      // get visibleItems() {
      //   console.log("CALLING visibleItems()");
      //   return this.items.filter(item => !item.hidden);
      // }
    });
  }
}

// import { decorate, observable } from "mobx"

// const store = (window.store = new RootStore());
const store = (window.store = new TodoStore());

export default store;
