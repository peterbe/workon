import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { observer } from "mobx-react";
import KintoClient from "kinto-http";
import "bulma/css/bulma.css";
import "csshake/dist/csshake.css";
import TimeLine from "./TimeLine";
import Auth from "./Auth";
import Settings from "./Settings";
import "./App.css";
import "./Pyro.css";
import { OpenIDClient, KINTO_URL } from "./OpenIDClient";
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

// const BUCKET = "default";
// const COLLECTION = 'oidc-demo';

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

const App = observer(
  class App extends React.Component {
    componentDidMount() {
      store.todos.obtain();
      this.authenticate();
    }

    authenticate() {
      this.kintoClient = new KintoClient(KINTO_URL);
      // this.kintoClient.fetchServerInfo().then(data => {
      //   // console.log("DATA", data);
      //   this.providers = data.capabilities.openid.providers;
      //   this.setState({ kintoInfo: data });
      // });
      this.authClient = new OpenIDClient();
      const authResult = this.authClient.authenticate();
      if (window.location.hash) {
        console.warn(`Removing location hash '${window.location.hash}'`);
        window.location.hash = "";
      }

      if (authResult) {
        // console.log("AuthResult", authResult);
        // const { provider, accessToken, tokenType, idTokenPayload } = authResult;
        const { provider, accessToken, tokenType } = authResult;

        // Set access token for requests to Kinto.
        this.kintoClient.setHeaders({
          Authorization: `${tokenType} ${accessToken}`
        });
        this.authClient
          .userInfo(this.kintoClient, provider, accessToken)
          .then(userInfo => {
            // console.log("userInfo", userInfo);
            store.user.userInfo = userInfo;
            store.todos.accessToken = accessToken;
            store.todos.sync();
            // store.todos.remoteSync(this.kintoClient, userInfo);
          });
      } else {
        // We're not already logged in. Query the kinto server to extract
        // the list of possible providers.
        this.kintoClient.fetchServerInfo().then(data => {
          this.providers = data.capabilities.openid.providers;
        });
      }
    }

    logIn = event => {
      // console.log("WORK HARDER");
      this.authClient.authorize(this.providers[0]);
    };

    logOut = event => {
      this.authClient.logout();
      // this.setState({ loggedIn: false });
    };

    render() {
      return (
        <Router>
          <div className="container">
            <div className="box">
              {store.user.userInfo ? (
                <Link to="auth">
                  <figure
                    className="image is-32x32 is-pulled-right avatar"
                    title={`Logged in as ${store.user.userInfo.name}, ${
                      store.user.userInfo.email
                    }`}
                  >
                    <img src={store.user.userInfo.picture} alt="Avatar" />
                  </figure>
                </Link>
              ) : null}

              <Switch>
                <Route path="/" exact component={TodoList} />
                <Route path="/timeline" exact component={TimeLine} />
                <Route
                  path="/auth"
                  exact
                  render={props => (
                    <Auth {...props} logIn={this.logIn} logOut={this.logOut} />
                  )}
                />
                <Route path="/settings" exact component={Settings} />
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
                  <li>
                    <Link to="/auth">Authentication</Link>
                  </li>
                  <li>
                    <Link to="/settings">Settings</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </Router>
      );
    }
  }
);

export default App;

const TodoList = observer(
  class TodoList extends React.Component {
    state = {
      hideDone: JSON.parse(sessionStorage.getItem("hideDone", "false")),
      showPyros: false
    };

    componentWillUnmount() {
      this.dismounted = true;
    }

    componentDidMount() {
      this.refs.new.focus();
      document.title = "Things To Work On";
      // store.todos.obtain();
    }

    itemFormSubmit = event => {
      event.preventDefault();
      const text = this.refs.new.value.trim();
      if (text) {
        store.todos.addItem(text);
        this.refs.new.value = "";
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
        this.showPyrosTemporarily();
      }
    };

    deleteItem = item => {
      store.todos.deleteItem(item);
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
      console.log("UNDO DELETE ON", store.todos.deletedItem);
      store.todos.deleteItem(store.todos.deletedItem);
    };
    undoCleanSlate = event => {
      store.todos.undoCleanSlate();
    };

    editItemText = (text, notes, item) => {
      store.todos.editItemText(text, notes, item);
    };

    toggleEditItem = (item = null) => {
      store.todos.editItem = item;
    };

    toggleHideDone = event => {
      this.setState({ hideDone: !this.state.hideDone }, () => {
        sessionStorage.setItem("hideDone", JSON.stringify(this.state.hideDone));
      });
    };

    render() {
      const items = store.todos.items.filter(item => !item.deleted);
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
                  onClick={event => {
                    store.todos.cleanSlate();
                  }}
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

          {store.todos.syncLog ? (
            <p>
              <small>{JSON.stringify(store.todos.syncLog)}</small>
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
            • {item.text}
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
