import { action, extendObservable } from "mobx";

// configure({ enforceActions: true });

class TodoStore {
  constructor(rootStore) {
    this.rootStore = rootStore;

    extendObservable(this, {
      items: [],
      deletedItem: null,
      editItem: null,
      obtain: action(() => {
        const items = JSON.parse(localStorage.getItem("items") || "[]");
        if (items.length) {
          this.items = items;
        }
      }),
      persist: action(() => {
        localStorage.setItem("items", JSON.stringify(this.items));
      })
    });
  }
}

// import { decorate, observable } from "mobx"

// const store = (window.store = new RootStore());
const store = (window.store = new TodoStore());

export default store;
