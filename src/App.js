import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { observer } from "mobx-react";
import PullToRefresh from "pulltorefreshjs";
import "bulma/css/bulma.css";
import "bulma-badge/dist/css/bulma-badge.min.css";
import "csshake/dist/csshake.css";
import TodoList from "./TodoList";
import TimeLine from "./TimeLine";
import Auth from "./Auth";
import Settings from "./Settings";
import SyncLog from "./SyncLog";

import "./App.css";
import "./Pyro.css";
import auth0 from "auth0-js";
import Loadable from "react-loading-overlay";

import {
  OIDC_DOMAIN,
  OIDC_CLIENT_ID,
  OIDC_CALLBACK_URL,
  OIDC_AUDIENCE
} from "./Config";

import { formatDistance } from "date-fns/esm";

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
    state = {
      loading: !sessionStorage.getItem("notFirstTime")
    };
    componentDidMount() {
      if (this.state.loading) {
        this.stopLoadingTimer = window.setTimeout(() => {
          this.setState({ loading: false });
        }, 2000);
      }
      sessionStorage.setItem("notFirstTime", true);

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

        let startAccessTokenRefreshLoop = !!authResult;

        if (!authResult) {
          authResult = JSON.parse(localStorage.getItem("authResult"));
          if (authResult) {
            startAccessTokenRefreshLoop = true;
          }
          const expiresAt = JSON.parse(localStorage.getItem("expiresAt"));
          if (expiresAt && expiresAt - new Date().getTime() < 0) {
            // Oh no! It has expired.
            authResult = null;
          }
        }
        if (authResult) {
          // The contents of authResult depend on which authentication parameters were used.
          // It can include the following:
          // authResult.accessToken - access token for the API specified by `audience`
          // authResult.expiresIn - string with the access token's expiration time in seconds
          // authResult.idToken - ID token JWT containing user profile information
          this._postProcessAuthResult(authResult);
        }
        if (startAccessTokenRefreshLoop) {
          this.accessTokenRefreshLoop();
        }
      });
    }

    _postProcessAuthResult = authResult => {
      if (authResult) {
        store.user.userInfo = authResult.idTokenPayload;
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
        console.warn("Time to fresh the auth token!");
        this.webAuth.checkSession({}, (err, authResult) => {
          if (err) {
            if (err.error === "login_required") {
              console.warn("Error in checkSession requires a new login");
              return this.logIn();
            } else {
              console.warn("Error trying to checkSession");
              return console.error(err);
            }
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
          <Loadable
            active={this.state.loading}
            spinner
            background="rgba(256, 256, 256, 0.92)"
            color="#000"
            spinnerSize="140px"
            text="Loading the app..."
          >
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
                      <Auth
                        {...props}
                        logIn={this.logIn}
                        logOut={this.logOut}
                      />
                    )}
                  />
                  <Route path="/settings" exact component={Settings} />
                  <Route path="/synclog" exact component={SyncLog} />
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
          </Loadable>
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
