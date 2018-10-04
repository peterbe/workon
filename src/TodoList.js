import React from "react";
import { observer } from "mobx-react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Link } from "react-router-dom";
import play from "audio-play";
import load from "audio-loader";
import {
  toDate,
  isSameDay,
  subDays,
  startOfDay,
  formatDistance,
  formatDistanceStrict
} from "date-fns/esm";

import EditModal from "./EditModal";
import { ContextTag } from "./Common";

import store from "./Store";

const SOUNDS = {
  coin: "./sounds/coin.mp3",
  bump: "./sounds/bump.mp3",
  ping: "./sounds/ping.mp3",
  smash: "./sounds/smash.mp3",
  dead: "./sounds/dead.mp3",
  jump: "./sounds/jump.mp3"
};

export default observer(
  class TodoList extends React.Component {
    state = {
      hideDone: JSON.parse(localStorage.getItem("hideDone", "false")),
      showPyros: false,
      startInAdvancedMode: false
    };

    componentWillUnmount() {
      this.dismounted = true;
    }

    componentDidMount() {
      if (!sessionStorage.getItem("notFirstTime")) {
        // If it's the very first time you open this app, focus on the input.
        this.refs.new.focus();
      }
      document.title = "Things To Work On";

      const reg = /context=(.*)/;
      if (window.location.hash && reg.test(window.location.hash)) {
        const found = window.location.hash.match(reg)[1];
        store.todos.contextFilter = decodeURIComponent(found);
      }
    }

    _sounds = {};
    _loadSound = name => {
      if (this._sounds[name]) {
        return Promise.resolve(this._sounds[name]);
      }

      return load(SOUNDS[name]).then(audioBuffer => {
        this._sounds[name] = audioBuffer;
        return audioBuffer;
      });
    };

    playSound = name => {
      if (!SOUNDS[name]) {
        throw new Error(`Unrecognized sound '${name}'.`);
      }
      this._loadSound(name).then(() => {
        play(this._sounds[name]);
      });
    };

    itemFormSubmit = event => {
      event.preventDefault();
      const text = this.refs.new.value.trim();
      if (text) {
        store.todos.addItem(text);
        this.refs.new.value = "";
        this.playSound("ping");
      }
    };

    showPyrosTemporarily = (mseconds = 5000) => {
      this.setState({ showPyros: true }, () => {
        window.setTimeout(() => {
          if (!this.dismounted) {
            this.setState({ showPyros: false });
          }
        }, mseconds);
      });
    };

    doneItem = item => {
      const wasNotDone = !item.done;
      store.todos.doneItem(item);
      if (wasNotDone) {
        this.playSound("coin");
        this.showPyrosTemporarily();
      } else {
        this.playSound("bump");
      }
    };

    deleteItem = item => {
      store.todos.deleteItem(item);
      this.playSound("smash");
      if (this.giveupUndoTimeout) {
        window.clearTimeout(this.giveupUndoTimeout);
      }
      this.giveupUndoTimeout = window.setTimeout(() => {
        if (!this.dismounted) {
          if (store.todos.deletedItem) {
            store.todos.deletedItem = null;
          }
        }
      }, 10 * 1000);
    };

    undoDelete = () => {
      // store.todos.undoDelete();
      // console.log("UNDO DELETE ON", store.todos.deletedItem);
      store.todos.deleteItem(store.todos.deletedItem);
      this.playSound("ping");
    };

    undoCleanSlate = event => {
      store.todos.undoCleanSlate();
      this.playSound("dead");
    };

    cleanSlate = even => {
      store.todos.cleanSlate();
      this.playSound("jump");
    };

    editItemText = (text, notes, item) => {
      store.todos.editItemText(item, text, notes);
    };

    editItemContext = (context, item) => {
      store.todos.editItemContext(item, context);
    };

    toggleEditItem = (item = null, advancedMode = false) => {
      this.setState({ startInAdvancedMode: advancedMode }, () => {
        store.todos.editItem = item;
      });
    };

    toggleHideDone = event => {
      this.setState({ hideDone: !this.state.hideDone }, () => {
        localStorage.setItem("hideDone", JSON.stringify(this.state.hideDone));
      });
    };

    render() {
      const allContexts = {
        "": 0
      };
      store.todos.items.forEach(item => {
        if (item.context) {
          const context = item.context || "";
          if (!allContexts[context]) {
            allContexts[context] = 0;
          }
          allContexts[context]++;
        }
        allContexts[""]++;
      });
      const allContextKeys = Object.keys(allContexts).sort();
      const items = store.todos.items.filter(item => {
        if (
          store.todos.contextFilter &&
          item.context !== store.todos.contextFilter
        ) {
          return false;
        }
        return !item.deleted;
      });
      const visibleItems = items.filter(item => !item.hidden);
      const showItems = visibleItems.filter(item => {
        if (this.state.hideDone) {
          return !item.done;
        }
        return true;
      });
      const countDone = visibleItems.filter(item => item.done).length;
      const countAll = items.length;
      const countVisible = visibleItems.length;
      const allDates = visibleItems.map(item => item.created);

      return (
        <div>
          <h1>Things To Work On</h1>

          {this.state.showPyros ? (
            <div className="pyro">
              <div className="before" />
              <div className="after" />
            </div>
          ) : null}

          {store.todos.deletedItem ? (
            <div className="notification is-warning undo-notification">
              {/* <button
                className="delete"
                onClick={event => {
                  store.todos.deletedItem = null;
                }}
              /> */}
              <button className="button is-primary" onClick={this.undoDelete}>
                Undo Delete
              </button>{" "}
              <button
                className="button is-small"
                onClick={event => {
                  store.todos.deletedItem = null;
                }}
              >
                Close
              </button>
            </div>
          ) : null}

          {store.todos.cleanSlateDate ? (
            <div className="notification is-warning  undo-notification">
              <button
                className="delete"
                onClick={event => {
                  store.todos.cleanSlateDate = null;
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
                  store.todos.cleanSlateDate = null;
                }}
              >
                Close
              </button>
            </div>
          ) : null}

          {store.todos.editItem ? (
            <EditModal
              item={store.todos.editItem}
              edit={this.editItemText}
              move={this.editItemContext}
              close={this.toggleEditItem}
              delete={this.deleteItem}
              done={this.doneItem}
              allContextOptions={store.todos.allContextOptions}
              startInAdvancedMode={this.state.startInAdvancedMode}
            />
          ) : null}

          <div className="list-container">
            <form onSubmit={this.itemFormSubmit}>
              <input
                className="input add-item"
                type="text"
                ref="new"
                placeholder="What's next?"
              />
            </form>
            {allContextKeys.length > 1 ? (
              <div className="tabs is-small">
                <ul>
                  {allContextKeys.map(context => {
                    return (
                      <li
                        key={context}
                        className={
                          store.todos.contextFilter === context ||
                          (!store.todos.contextFilter && !context)
                            ? "is-active"
                            : null
                        }
                      >
                        <a
                          href={`#context=${context}`}
                          onClick={event => {
                            event.preventDefault();
                            if (context) {
                              store.todos.contextFilter = context;
                              window.location.hash = `#context=${context}`;
                            } else {
                              store.todos.contextFilter = null;
                              window.location.hash = "";
                            }
                          }}
                        >
                          {context ? context : "All"} ({allContexts[context]})
                          {/* <span className="tag is-dark">
                            {context ? context : "All"}
                          </span> */}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
            <div className="list-container-inner">
              <TransitionGroup>
                {showItems.map(item => (
                  <CSSTransition
                    key={item.id || item.created}
                    timeout={300}
                    classNames="fade"
                  >
                    {/* Is this (below) key= needed? */}
                    <Item
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

          {showItems.length ? (
            <div className="columns">
              <div className="column">
                <button
                  className="button is-info is-fullwidth"
                  onClick={this.cleanSlate}
                >
                  Clean Slate
                </button>
              </div>
              <div className="column">
                <button
                  className="button is-info is-fullwidth"
                  onClick={this.toggleHideDone}
                >
                  {this.state.hideDone
                    ? `Show Done Items (${countDone})`
                    : `Hide Done Items (${countDone})`}
                </button>
              </div>
            </div>
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
                  store.todos.undoCleanSlate();
                }}
              >
                Show all ({countAll - countVisible}) hidden items
              </button>
            </p>
          ) : null}

          <ShowSyncLog syncLog={store.todos.syncLog} />
        </div>
      );
    }
  }
);

const ShowSyncLog = observer(
  class ShowSyncLog extends React.Component {
    subRender = syncLog => {
      if (!(syncLog.lastSuccess || syncLog.lastFailure)) {
        return (
          <Link
            to="/auth"
            title="Authenticate to enable backup"
            className="has-text-warning"
          >
            Data <i>not</i> backed up.
          </Link>
        );
      } else if (
        (syncLog.lastSuccess && !syncLog.lastFailure) ||
        syncLog.lastSuccess > syncLog.lastFailure
      ) {
        return (
          <Link to="/synclog" className="has-text-success">
            Data backed up{" "}
            {formatDistance(syncLog.lastSuccess, new Date(), {
              addSuffix: true
            })}
            .
          </Link>
        );
      } else if (
        (syncLog.lastFailure && !syncLog.lastSuccess) ||
        syncLog.lastFailure > syncLog.lastSuccess
      ) {
        return (
          <Link to="/synclog" className="has-text-danger">
            Last data backed-up failed{" "}
            {formatDistance(syncLog.lastFailure, new Date(), {
              addSuffix: true
            })}
            .
          </Link>
        );
      }
      return <small>{JSON.stringify(store.todos.syncLog)}</small>;
    };
    render() {
      return (
        <p className="has-text-centered">
          {this.subRender(store.todos.syncLog)}
        </p>
      );
    }
  }
);

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
          <ContextTag
            context={item.context}
            onClick={event => {
              event.preventDefault();
              this.props.setEditItem(item, true);
            }}
          />
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
            {item.text}
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
