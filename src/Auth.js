import React from "react";
import { observer } from "mobx-react";

import store from "./Store";

const Auth = observer(
  class Auth extends React.Component {
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

          {store.user.serverError ? (
            <ShowServerError
              error={store.user.serverError}
              close={event => {
                store.user.serverError = null;
              }}
            />
          ) : null}

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
        </div>
      );
    }
  }
);

export default Auth;

class ShowServerError extends React.PureComponent {
  render() {
    return (
      <div className="notification is-warning" style={{ margin: 30 }}>
        <button className="delete" onClick={this.props.close} />
        <p>
          <b>Authentication Server Error</b>
        </p>
        <p>
          Tried to authenticate (or fetch authentication information) and it
          failed due to a server error.
        </p>
        {this.props.error.status ? (
          <p>
            Status code <code>{this.props.error.status}</code>
          </p>
        ) : (
          <pre>{JSON.stringify(this.props.error)}</pre>
        )}
      </div>
    );
  }
}
