import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { observer } from "mobx-react";
import PullToRefresh from "pulltorefreshjs";
import "bulma/css/bulma.css";
import "bulma-badge/dist/css/bulma-badge.min.css";
import "csshake/dist/csshake.css";
import TimeLine from "./TimeLine";
import Auth from "./Auth";
import Settings from "./Settings";
import EditModal from "./EditModal";
import "./App.css";
import "./Pyro.css";
import auth0 from "auth0-js";
import {
  OIDC_DOMAIN,
  OIDC_CLIENT_ID,
  OIDC_CALLBACK_URL,
  OIDC_AUDIENCE
} from "./Config";

import {
  toDate,
  isSameDay,
  subDays,
  startOfDay,
  formatDistance,
  formatDistanceStrict
} from "date-fns/esm";

import store from "./Store";

// Hacky solution to make it possible to manually pretend that the
// access token is about to expire.
// In the Web Console, type in something like `windExpires(23.5)` and
// it will make it so that the access token is going to 23.5h sooner
// than now.
window.windExpires = function(hours) {
  let e = JSON.parse(localStorage.expiresAt);
  e -= 1000 * 60 * 60 * hours;
  localStorage.setItem("expiresAt", e);
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

      this.pullToRefresh = PullToRefresh.init({
        mainElement: "body",
        onRefresh: () => {
          if (store.todos.accessToken) {
            store.todos.sync();
          }
        }
      });
    }

    componentWillUnmount() {
      this.dismounted = true;
      if (this.pullToRefresh) {
        this.pullToRefresh.destroyAll();
      }
    }

    // Sign in either by localStorage or by window.location.hash
    authenticate() {
      this.webAuth = new auth0.WebAuth({
        domain: OIDC_DOMAIN,
        clientID: OIDC_CLIENT_ID,
        redirectUri: OIDC_CALLBACK_URL,
        audience: OIDC_AUDIENCE,
        responseType: "token id_token",
        scope: "openid profile email"
      });

      this.webAuth.parseHash({}, (err, authResult) => {
        if (err) {
          return console.error(err);
        }

        if (authResult && window.location.hash) {
          window.location.hash = "";
        }

        if (!authResult) {
          authResult = JSON.parse(localStorage.getItem("authResult"));
        }

        // The contents of authResult depend on which authentication parameters were used.
        // It can include the following:
        // authResult.accessToken - access token for the API specified by `audience`
        // authResult.expiresIn - string with the access token's expiration time in seconds
        // authResult.idToken - ID token JWT containing user profile information
        this._postProcessAuthResult(authResult);
      });
    }

    _postProcessAuthResult = authResult => {
      if (authResult) {
        // Conver the accessToken to a user profile so we can
        // indicate who logged in.
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
        if (userInfo) {
          store.user.userInfo = userInfo;
        } else {
          this.webAuth.client.userInfo(authResult.accessToken, (err, user) => {
            if (err) {
              store.user.serverError = err;
              return console.error(err);
            }
            // Now you have the user's information
            store.user.userInfo = user;
            // Cache this in the current tab. This assumes that the name
            // and email doesn't change much.
            localStorage.setItem("userInfo", JSON.stringify(user));
            store.user.serverError = null;
          });
        }

        store.todos.accessToken = authResult.accessToken;
        store.todos.sync();

        const expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
        if (authResult.state) {
          // XXX we could use authResult.state to redirect to where you
          // came from.
          delete authResult.state;
        }
        localStorage.setItem("authResult", JSON.stringify(authResult));
        localStorage.setItem("expiresAt", JSON.stringify(expiresAt));
        this.accessTokenRefreshLoop();
      }
    };

    accessTokenRefreshLoop = () => {
      // Return true if the access token has expired (or is about to expire)
      const expiresAt = JSON.parse(localStorage.getItem("expiresAt"));
      // 'age' in milliseconds
      let age = expiresAt - new Date().getTime();
      console.log(
        "accessToken expires in",
        formatDistance(expiresAt, new Date())
      );
      // Consider the accessToken to be expired if it's about to expire
      // in 30 minutes.
      age -= 30 * 60 * 1000;
      const timeToRefresh = age < 0;

      if (timeToRefresh) {
        this.webAuth.checkSession({}, (err, authResult) => {
          if (err) {
            console.warn("Error trying to checkSession");
            return console.error(err);
          }
          this._postProcessAuthResult(authResult);
        });
      } else {
        window.setTimeout(() => {
          if (!this.dismounted) {
            this.accessTokenRefreshLoop();
          }
        }, 5 * 60 * 1000);
        // }, 10 * 1000);
      }
    };

    logIn = () => {
      this.webAuth.authorize({
        // state: returnUrl,
        state: ""
      });
    };

    logOut = () => {
      localStorage.removeItem("expiresAt");
      localStorage.removeItem("authResult");
      localStorage.removeItem("userInfo");
      const rootUrl = `${window.location.protocol}//${window.location.host}/`;
      this.webAuth.logout({
        returnTo: rootUrl,
        clientID: OIDC_CLIENT_ID
      });
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
                    <Link to="/auth">
                      <AuthLinkText
                        serverError={store.user.serverError}
                        userInfo={store.user.userInfo}
                      />
                    </Link>
                    {/* <Link to="/auth">Authentication</Link> */}
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

class AuthLinkText extends React.PureComponent {
  render() {
    const { serverError, userInfo } = this.props;
    let className = "badge is-badge-small";
    let data = "";
    let title = "";
    if (serverError) {
      className += " is-badge-danger";
      data = "!";
      title = "Authentication failed because of a server error";
    } else if (userInfo) {
      className += " is-badge-success";
      title = `Logged in as ${store.user.userInfo.name}, ${
        store.user.userInfo.email
      }`;
    } else {
      className += " is-badge-warning";
      title = "You are not logged in so no remote backups can be made.";
    }
    return (
      <span className={className} data-badge={data} title={title}>
        Authentication
      </span>
    );
  }
}

const TodoList = observer(
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
          <small
            title="Authenticate to enable backup"
            className="has-text-warning"
          >
            Data <i>not</i> backed up.
          </small>
        );
      } else if (
        (syncLog.lastSuccess && !syncLog.lastFailure) ||
        syncLog.lastSuccess > syncLog.lastFailure
      ) {
        return (
          <small className="has-text-success">
            Data backed up{" "}
            {formatDistance(syncLog.lastSuccess, new Date(), {
              addSuffix: true
            })}.
          </small>
        );
      } else if (
        (syncLog.lastFailure && !syncLog.lastSuccess) ||
        syncLog.lastFailure > syncLog.lastSuccess
      ) {
        return (
          <small className="has-text-danger">
            Last data backed-up failed{" "}
            {formatDistance(syncLog.lastFailure, new Date(), {
              addSuffix: true
            })}.
          </small>
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

const ContextTag = ({ context, onClick }) => {
  if (!context) {
    return null;
  }
  return (
    <span onClick={onClick} className="tag is-dark is-pulled-right">
      {context}
    </span>
  );
};
