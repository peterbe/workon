import React from "react";
import { observer } from "mobx-react";

import store from "./Store";

const Auth = observer(
  class Auth extends React.Component {
    state = {
      kintoInfo: null
      // loggedIn: false
    };
    pageTitle = "Authentication";
    componentDidMount() {
      document.title = this.pageTitle; // XXX Use helmet
    }

    componentWillUnmount() {
      this.dismounted = true;
    }

    render() {
      return (
        <div>
          <h1>{this.pageTitle}</h1>

          <p style={{ textAlign: "center" }}>
            {store.user.userInfo ? (
              <button
                className="button is-large is-warning"
                onClick={this.props.logOut}
              >
                Log Out
              </button>
            ) : (
              <button
                className="button is-large is-primary"
                onClick={this.props.logIn}
              >
                Log In
              </button>
            )}
          </p>

          {store.user.userInfo ? (
            <div className="box">
              <h2>
                Logged in as: <code>{store.user.userInfo.email}</code>
              </h2>
            </div>
          ) : null}

          {this.state.kintoInfo ? (
            <div className="box">
              <h4>Kinto Server</h4>
              <pre>{JSON.stringify(this.state.kintoInfo, undefined, 2)}</pre>
            </div>
          ) : null}
        </div>
      );
    }
  }
);

export default Auth;
