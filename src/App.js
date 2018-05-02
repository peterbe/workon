import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { observer } from "mobx-react";
import "bulma/css/bulma.css";
import "./App.css";
import { Container, Content } from "bloomer";
import Linkify from "react-linkify";

import {
  toDate,
  // isBefore,
  formatDistance
  // formatDistanceStrict,
  // differenceInSeconds,
  // differenceInMilliseconds,
} from "date-fns/esm";

import store from "./Store";

const DisplayDate = date => {
  if (date === null) {
    throw new Error("date is null");
  }
  const dateObj = toDate(date);
  const now = new Date();
  return (
    <span title={dateObj.toString()}>
      {formatDistance(date, now, { addSuffix: true })}
    </span>
  );
  // if (isBefore(dateObj, now)) {
  //   return <span title={date}>{formatDistance(date, now)} ago</span>;
  // } else {
  //   return <span title={date}>in {formatDistance(date, now)}</span>;
  // }
};

class App extends React.Component {
  render() {
    return (
      <Container>
        <TodoList />
      </Container>
    );
  }
}

export default App;

const TodoList = observer(
  class TodoList extends React.Component {
    componentWillUnmount() {
      this.dismounted = true;
    }

    componentDidMount() {
      this.refs.new.focus();
      store.obtain();
    }

    itemFormSubmit = event => {
      event.preventDefault();
      const text = this.refs.new.value.trim();
      if (text) {
        const previousIds = store.items.map(item => item.id);
        let nextId = 1;
        if (previousIds.length) {
          nextId = Math.max(...previousIds) + 1;
        }
        const now = new Date();
        store.items.unshift({
          text,
          done: null,
          created: now.getTime(),
          modified: now.getTime(),
          id: nextId
        });
        store.persist();
        this.refs.new.value = "";
      }
    };

    doneItem = item => {
      const thisItemIndex = store.items.findIndex(i => i.id === item.id);
      const thisItem = store.items[thisItemIndex];
      if (thisItem.done) {
        thisItem.done = null;
      } else {
        thisItem.done = new Date().getTime();
      }
      store.items[thisItemIndex] = thisItem;
      store.editItem = null;
      store.persist();
    };

    deleteItem = item => {
      store.deleteItem = item;
      store.editItem = null;
      store.items.remove(item);
      store.persist();
      if (this.giveupUndoTimeout) {
        window.clearTimeout(this.giveupUndoTimeout);
      }
      this.giveupUndoTimeout = window.setTimeout(() => {
        if (!this.dismounted) {
          if (store.deletedItem) {
            store.deletedItem = null;
          }
        }
      }, 10 * 1000);
    };

    undoDelete = () => {
      store.items.push(store.deletedItem);
      store.items.sort((a, b) => b.id - a.id);
      store.deletedItem = null;
      store.persist();
    };

    editItemText = (text, item) => {
      const thisItemIndex = store.items.findIndex(i => i.id === item.id);
      const thisItem = store.items[thisItemIndex];
      thisItem.text = text;
      thisItem.modified = new Date().getTime();
      store.items[thisItemIndex] = thisItem;
      store.persist();
    };

    toggleEditItem = (item = null) => {
      store.editItem = item;
    };

    render() {
      return (
        <div className="box">
          <Content>
            <h1>Things To Work On</h1>

            {store.deletedItem ? (
              <div className="notification is-warning">
                <button
                  className="delete"
                  onClick={event => {
                    store.deletedItem = null;
                  }}
                />
                <button className="button" onClick={this.undoDelete}>
                  Undo Delete
                </button>
              </div>
            ) : null}

            {store.editItem ? (
              <EditModal
                item={store.editItem}
                edit={this.editItemText}
                close={this.toggleEditItem}
                delete={this.deleteItem}
                done={this.doneItem}
              />
            ) : null}

            <ul>
              <li style={{ listStyle: "none" }}>
                <form onSubmit={this.itemFormSubmit}>
                  <input
                    className="input add-item"
                    type="text"
                    ref="new"
                    placeholder="What's next??"
                  />
                </form>
              </li>
              <ReactCSSTransitionGroup
                transitionName="items"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnter={false}
                transitionLeave={false}
              >
                {store.items.map(item => (
                  <Item
                    key={item.id}
                    item={item}
                    deleteItem={this.deleteItem}
                    doneItem={this.doneItem}
                    editItemText={this.editItemText}
                    setEditItem={this.toggleEditItem}
                  />
                ))}
                {/* {items} */}
              </ReactCSSTransitionGroup>
            </ul>
          </Content>
        </div>
      );
    }
  }
);

class EditModal extends React.Component {
  componentDidMount() {
    this.refs.text.focus();
    window.addEventListener("keydown", this._escapeKey, true);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this._escapeKey, true);
  }

  _escapeKey = event => {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    if (event.key === "Escape") {
      this.props.close();
    }
  };

  itemFormSubmit = event => {
    event.preventDefault();
    const text = this.refs.text.value.trim();
    if (text) {
      this.props.edit(text, this.props.item);
      this.props.close();
    } else {
      this.props.delete(this.props.item);
      this.props.close();
    }
  };
  render() {
    const { item } = this.props;
    return (
      <div className="modal is-active">
        <div
          className="modal-background"
          onClick={event => {
            this.props.close();
          }}
        />

        <div className="modal-content">
          <div className="box">
            <div className="is-clearfix" style={{ marginBottom: 20 }}>
              <button
                type="button"
                className="button is-pulled-right is-danger"
                onClick={event => {
                  this.props.delete(item);
                }}
              >
                DELETE
              </button>
              <button
                type="button"
                className="button is-pulled-left is-success"
                onClick={event => {
                  this.props.done(item);
                }}
              >
                <span role="img" aria-label="Toggle done">
                  ✔️
                </span>
                DONE!
              </button>
            </div>

            <form onSubmit={this.itemFormSubmit}>
              <input
                className="input edit-item"
                type="text"
                ref="text"
                defaultValue={item.text}
              />
            </form>

            <p>
              <b>Added:</b> {DisplayDate(item.created)}
              <br />
              {item.created !== item.modified ? (
                <span>
                  <b>Edited:</b> {DisplayDate(item.modified)}
                </span>
              ) : null}
            </p>

            <button className="button is-success" onClick={this.itemFormSubmit}>
              Save
            </button>
            <button
              className="button"
              onClick={event => {
                this.props.close();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class Item extends React.Component {
  state = {
    displayMetadata: false,
    editMode: false,
    newText: null
  };

  toggleEditMode = event => {
    if (this.state.newText === null) {
      this.setState({ newText: this.props.item.text });
    }
    this.setState({ editMode: !this.state.editMode }, () => {
      if (this.state.editMode) {
        this.refs.text.focus();
      } else {
        // Time to save!
        this.props.editItemText(this.state.newText, this.props.item);
      }
    });
  };
  handleTextEdit = event => {
    this.setState({ newText: event.target.value });
  };

  _swipe = {};
  // swiping = false
  // swiped = false
  minSwipeDistance = 100;

  handleTouchStart = event => {
    const touch = event.touches[0];
    this._swipe.x = touch.clientX;
    this.refs.textcontainer.style["white-space"] = "nowrap";
    this.refs.textcontainer.style["overflow"] = "overlay";
    // console.log(this.refs.textcontainer.style);
    // console.log(this.refs.textcontainer.style["margin-left"]);
    // this.refs.textcontainer.style["margin-left"] = "-100px";
    // console.log("touchstart", event);
    // this.moved = 0;
  };
  handleTouchMove = event => {
    if (event.changedTouches && event.changedTouches.length) {
      const touch = event.changedTouches[0];
      this._swipe.swiping = true;
      // console.log("X", touch.clientX);
      // console.log(this.refs.textcontainer);
      const diff = touch.clientX - this._swipe.x;
      // console.log("DIFF", diff);
      this.refs.textcontainer.style["margin-left"] = `${diff}px`;
    }
  };
  handleTouchEnd = event => {
    // console.log("touchend", event);
    const touch = event.changedTouches[0];
    const absX = Math.abs(touch.clientX - this._swipe.x);
    if (this._swipe.swiping && absX > this.minSwipeDistance) {
      // this.props.onSwiped && this.props.onSwiped();
      // this.setState({ swiped: true });
      // console.log("SWIPED!");
      this.props.doneItem(this.props.item);
    }
    this._swipe = {};
    this.refs.textcontainer.style["margin-left"] = "0";
    this.refs.textcontainer.style["white-space"] = "normal";
    this.refs.textcontainer.style["overflow"] = "unset";
  };

  render() {
    const { item } = this.props;
    const createdDateObj = toDate(item.created);
    const modifiedDateObj = toDate(item.modified);
    let itemClassName = "";
    if (item.done) {
      itemClassName = "strikeout";
    }
    return (
      <li
        title={
          item.created === item.modified
            ? `Added ${createdDateObj}`
            : `Added ${modifiedDateObj}`
        }
      >
        {/* <nav className="level">
          <div className="level-left">
            <div className="level-item">
              <div>
                {this.state.editMode ? (
                  <form onSubmit={this.toggleEditMode}>
                    <input
                      type="text"
                      ref="text"
                      onChange={this.handleTextEdit}
                      defaultValue={item.text}
                      onBlur={this.toggleEditMode}
                    />
                  </form>
                ) : (
                  <p
                    className={itemClassName}
                    title="Click to edit"
                    onClick={this.toggleEditMode}
                  >
                    <Linkify
                      properties={{
                        target: "_blank",
                        onClick: event => {
                          event.preventDefault();
                          console.log(event);
                        }
                      }}
                    >
                      {item.text}
                    </Linkify>
                  </p>
                )}
                {this.state.displayMetadata ? (
                  <p className="metadata">
                    {item.created === item.modified ? (
                      <span>Added {DisplayDate(item.created)}</span>
                    ) : (
                      <span>Modified {DisplayDate(item.modified)}</span>
                    )}
                  </p>
                ) : (
                  <p className="metadata">&nbsp;</p>
                )}
              </div>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <button
                className={
                  item.done
                    ? "button is-small is-info"
                    : "button is-small is-success"
                }
                title="Mark as done"
                onClick={event => {
                  this.props.doneItem(item);
                }}
              >
                <span role="img" aria-label="Toggle done">
                  ✔️
                </span>
              </button>
            </div>
            <div className="level-item">
              <button
                className="button is-small is-warning"
                title="Delete"
                onClick={event => {
                  this.props.deleteItem(item);
                }}
              >
                <span role="img" aria-label="Delete">
                  🗑
                </span>
              </button>
            </div>
          </div>
        </nav> */}
        <p
          className={itemClassName}
          title="Click to edit"
          onClick={event => {
            this.props.setEditItem(item);
          }}
          ref="textcontainer"
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
        >
          <Linkify
            properties={{
              target: "_blank",
              onClick: event => {
                event.preventDefault();
                console.log(event);
              }
            }}
          >
            {item.text}
          </Linkify>
        </p>

        {this.state.displayMetadata ? (
          <p className="metadata">
            {item.created === item.modified ? (
              <span>Added {DisplayDate(item.created)}</span>
            ) : (
              <span>Modified {DisplayDate(item.modified)}</span>
            )}
          </p>
        ) : (
          <p className="metadata">&nbsp;</p>
        )}
      </li>
    );
  }
}
