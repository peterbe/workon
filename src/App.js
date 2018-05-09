import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { observer } from "mobx-react";
import "bulma/css/bulma.css";
import "csshake/dist/csshake.css";
import "./App.css";
import TimeLine from "./TimeLine";
// import Linkify from "react-linkify";

import {
  toDate,
  isSameDay,
  subDays,
  startOfDay,
  formatDistance,
  formatDistanceStrict
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
};

const NoMatch = ({ location }) => (
  <div>
    <h3>
      No match for <code>{location.pathname}</code>
    </h3>
  </div>
);

class App extends React.Component {
  componentDidMount() {
    store.obtain();
  }

  render() {
    return (
      <Router>
        <div className="container">
          <div className="box">
            <Switch>
              <Route path="/" exact component={TodoList} />
              <Route path="/timeline" exact component={TimeLine} />
              {/* <Route path="/blogitem/:id" component={EditBlogitem} /> */}
              <Route component={NoMatch} />
            </Switch>
            <nav
              className="breadcrumb is-centered has-bullet-separator"
              aria-label="breadcrumbs"
              style={{
                marginTop: 30,
                paddingTop: 10
              }}
            >
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/timeline">Time Line</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </Router>
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
      document.title = "Things To Work On";
      // store.obtain();
    }

    itemFormSubmit = event => {
      event.preventDefault();
      const text = this.refs.new.value.trim();
      if (text) {
        store.addItem(text);
        this.refs.new.value = "";
      }
    };

    doneItem = item => {
      store.doneItem(item);
    };

    deleteItem = item => {
      store.deleteItem(item);
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
      store.undoDelete();
    };
    undoCleanSlate = event => {
      store.undoCleanSlate();
    };

    editItemText = (text, notes, item) => {
      store.editItemText(text, notes, item);
    };

    toggleEditItem = (item = null) => {
      store.editItem = item;
    };

    render() {
      const visibleItems = store.items.filter(item => !item.hidden);
      const countAll = store.items.length;
      const countVisible = visibleItems.length;
      const allDates = visibleItems.map(item => item.created);

      return (
        <div>
          <h1>Things To Work On</h1>

          {store.deletedItem ? (
            <div className="notification is-warning undo-notification">
              {/* <button
                className="delete"
                onClick={event => {
                  store.deletedItem = null;
                }}
              /> */}
              <button className="button is-primary" onClick={this.undoDelete}>
                Undo Delete
              </button>{" "}
              <button
                className="button is-small"
                onClick={event => {
                  store.deletedItem = null;
                }}
              >
                Close
              </button>
            </div>
          ) : null}

          {store.cleanSlateDate ? (
            <div className="notification is-warning  undo-notification">
              <button
                className="delete"
                onClick={event => {
                  store.cleanSlateDate = null;
                }}
              />
              <button
                className="button is-primary"
                onClick={this.undoCleanSlate}
              >
                Undo Clean Slate?
              </button>{" "}
              <button
                className="button is-small"
                onClick={event => {
                  store.cleanSlateDate = null;
                }}
              >
                Close
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

          <div className="list-container">
            <form onSubmit={this.itemFormSubmit}>
              <input
                className="input add-item"
                type="text"
                ref="new"
                placeholder="What's next??"
              />
            </form>
            <div className="list-container-inner">
              <TransitionGroup>
                {visibleItems.map(item => (
                  <CSSTransition key={item.id} timeout={300} classNames="fade">
                    {/* Is this (below) key= needed? */}
                    <Item
                      key={item.id}
                      item={item}
                      allDates={allDates}
                      deleteItem={this.deleteItem}
                      doneItem={this.doneItem}
                      editItemText={this.editItemText}
                      setEditItem={this.toggleEditItem}
                    />
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          </div>

          {visibleItems.length ? (
            <p>
              <button
                className="button is-medium is-fullwidth"
                onClick={event => {
                  store.cleanSlate();
                }}
              >
                Clean Slate
              </button>
            </p>
          ) : (
            <p className="freshness-blurb">
              Ahhhhh! The freshness of starting afresh!
            </p>
          )}

          {countAll > countVisible ? (
            <p>
              <button
                className="button is-mini is-fullwidth"
                onClick={event => {
                  store.showAllHidden();
                }}
              >
                Show all ({countAll - countVisible}) hidden items
              </button>
            </p>
          ) : null}
        </div>
      );
    }
  }
);

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saveDisabled: true,
      editNotes: !!this.props.item.notes
    };
  }

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
    const notes =
      (this.state.editNotes && this.refs.notes.value.trim()) || null;
    if (text) {
      this.props.edit(text, notes, this.props.item);
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
                className={
                  item.done
                    ? "button is-pulled-left is-warning"
                    : "button is-pulled-left is-success"
                }
                onClick={event => {
                  this.props.done(item);
                }}
              >
                <span role="img" aria-label="Toggle done">
                  ✔️
                </span>
                {item.done ? "UNDONE!" : "DONE!"}
              </button>
            </div>

            <form onSubmit={this.itemFormSubmit}>
              <input
                className="input edit-item"
                type="text"
                ref="text"
                onChange={event => {
                  if (this.state.saveDisabled) {
                    this.setState({ saveDisabled: false });
                  }
                }}
                defaultValue={item.text}
              />
              {this.state.editNotes ? (
                <textarea
                  ref="notes"
                  className="textarea"
                  defaultValue={item.notes || ""}
                  onChange={event => {
                    if (this.state.saveDisabled) {
                      this.setState({ saveDisabled: false });
                    }
                  }}
                />
              ) : (
                <p>
                  <button
                    type="button"
                    className="button is-small is-text"
                    onClick={event => {
                      this.setState({ editNotes: true }, () => {
                        this.refs.notes.focus();
                      });
                    }}
                  >
                    Notes?
                  </button>
                </p>
              )}
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

            <div className="is-clearfix">
              <button
                className="button is-success is-pulled-left"
                onClick={this.itemFormSubmit}
                disabled={this.state.saveDisabled}
              >
                Save
              </button>
              <button
                className="button is-pulled-right"
                onClick={event => {
                  this.props.close();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Item = observer(
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
    minSwipeDistance = 100;

    handleTouchStart = event => {
      const touch = event.touches[0];
      this._swipe.x = touch.clientX;
      this._swipe.y = touch.clientY;
      this.refs.textcontainer.style["white-space"] = "nowrap";
      this.refs.textcontainer.style["overflow"] = "overlay";
    };
    handleTouchMove = event => {
      if (event.changedTouches && event.changedTouches.length) {
        const touch = event.changedTouches[0];
        const diffX = touch.clientX - this._swipe.x;
        const diffY = touch.clientY - this._swipe.y;

        // Don't engage in swiping-with-css unless the finger is just "wobbly"
        if (
          this._swipe.engaged ||
          (Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY))
        ) {
          this._swipe.swiping = true;
          this._swipe.engaged = true;
          this.refs.textcontainer.style["margin-left"] = `${diffX}px`;
          if (Math.abs(diffX) > 150) {
            this.refs.textcontainer.classList.remove("shake-little");
            this.refs.textcontainer.classList.remove("shake");
            this.refs.textcontainer.classList.add("shake-hard");
          } else if (Math.abs(diffX) > 50) {
            this.refs.textcontainer.classList.remove("shake-little");
            this.refs.textcontainer.classList.add("shake");
            this.refs.textcontainer.classList.remove("shake-hard");
          } else {
            this.refs.textcontainer.classList.add("shake-little");
            this.refs.textcontainer.classList.remove("shake");
            this.refs.textcontainer.classList.remove("shake-hard");
          }
          // console.log(diffX);

          // console.log(this.refs.textcontainer.classList);
        }
      }
    };
    handleTouchEnd = event => {
      const touch = event.changedTouches[0];
      const diffX = touch.clientX - this._swipe.x;
      const absX = Math.abs(diffX);
      if (this._swipe.swiping && absX > this.minSwipeDistance) {
        if (diffX < 0) {
          this.props.deleteItem(this.props.item);
        } else {
          this.props.doneItem(this.props.item);
        }
      }
      this._swipe = {};
      this.refs.textcontainer.style["margin-left"] = "0";
      this.refs.textcontainer.style["white-space"] = "normal";
      this.refs.textcontainer.style["overflow"] = "unset";
      this.refs.textcontainer.classList.remove("shake-little");
      this.refs.textcontainer.classList.remove("shake");
      this.refs.textcontainer.classList.remove("shake-hard");
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
        <div
          className="item"
          title={
            item.created === item.modified
              ? `Added ${createdDateObj}`
              : `Added ${modifiedDateObj}`
          }
        >
          <FriendlyDateTag datetime={item.created} />
          <p
            className={itemClassName}
            title="Click to edit"
            style={{ cursor: "pointer" }}
            onClick={event => {
              this.props.setEditItem(item);
            }}
            ref="textcontainer"
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={this.handleTouchEnd}
          >
            {/* <Linkify
            properties={{
              target: "_blank"
              // onClick: event => {
              //   event.preventDefault();
              //   console.log('EVENT',event);
              //   console.log('TARGET', event.target);
              // }
            }}
          >
            {item.text}
          </Linkify> */}
            ‣ {item.text}
          </p>
          {item.notes ? (
            <p className="metadata item-notes">
              <b>notes: </b>
              {/* <Linkify
              properties={{
                target: "_blank"
              }}
            >
              {item.notes}
            </Linkify> */}
              {item.notes}
            </p>
          ) : null}
        </div>
      );
    }
  }
);

const FriendlyDateTag = ({ datetime }) => {
  const now = new Date();
  let text;
  if (isSameDay(now, datetime)) {
    text = "Today";
  } else if (isSameDay(datetime, subDays(now, 1))) {
    text = "Yesterday";
    // } else if (dateFns.isSameDay(datetime, dateFns.addDays(now, 1))) {
    //   text = "Tomorrow";
  } else {
    text = formatDistanceStrict(datetime, startOfDay(now), {
      addSuffix: true
    });
  }

  return <span className="tag is-white is-pulled-right">{text}</span>;
};
