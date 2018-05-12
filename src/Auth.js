import React from "react";
import { observer } from "mobx-react";
import KintoClient from "kinto-http";
import store from "./Store";

const KINTO_URL = process.env.REACT_APP_KINTO_URL || "http://localhost:8888/v1";

const SCOPES = "openid email";
const BUCKET = "default";
// const COLLECTION = 'oidc-demo';

const Auth = observer(
  class Auth extends React.Component {
    state = {
      kintoInfo: null,
      loggedIn: false
    };
    pageTitle = "Authentication";
    componentDidMount() {
      document.title = this.pageTitle; // XXX Use helmet
      this.kintoClient = new KintoClient(KINTO_URL);
      this.kintoClient.fetchServerInfo().then(data => {
        // console.log("DATA", data);
        this.providers = data.capabilities.openid.providers;
        this.setState({ kintoInfo: data });
      });
      this.authClient = new OpenIDClient();
      const authResult = this.authClient.authenticate();
      // console.log("authResult", authResult);
      // const authResult = authClient.authenticate();
      window.location.hash = "";
      if (authResult) {
        // console.log("AuthResult", authResult);
        const { provider, accessToken, tokenType, idTokenPayload } = authResult;

        // Set access token for requests to Kinto.
        this.kintoClient.setHeaders({
          Authorization: `${tokenType} ${accessToken}`
        });
        this.setState({ loggedIn: true });
        try {
          const userInfo = this.authClient
            .userInfo(this.kintoClient, provider, accessToken)
            .then(userInfo => {
              console.log("userInfo", userInfo);
              store.user.userInfo = userInfo;
            });
        } catch (ex) {
          throw ex;
        }

        // Refresh UI with infos.
        // showTokenPayload(idTokenPayload);
        // initRecordForm(kintoClient);
        // Promise.all([
        //   showUserInfo(kintoClient, authClient, provider, accessToken),
        //   showAPIHello(kintoClient),
        //   showAPIRecords(kintoClient)
        // ]).catch(showError);
      }
    }

    componentWillUnmount() {
      this.dismounted = true;
    }

    logIn = event => {
      // console.log("WORK HARDER");
      this.authClient.authorize(this.providers[0]);
    };

    logOut = event => {
      this.authClient.logout();
      this.setState({ loggedIn: false });
    };

    render() {
      return (
        <div>
          <h1>{this.pageTitle}</h1>

          {this.state.loggedIn ? (
            <button onClick={this.logOut}>Log Out</button>
          ) : (
            <button onClick={this.logIn}>Log In</button>
          )}

          {store.user.userInfo ? (
            <div className="box">
              <pre>{JSON.stringify(store.user.userInfo)}</pre>
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

class OpenIDClient {
  async authorize(provider) {
    const { auth_path: authPath, name } = provider;
    const callback = `${window.location.href}#provider=${name}&tokens=`;
    // Redirect the browser to start the OAuth login dance.
    window.location = `${KINTO_URL}${authPath}?callback=${encodeURIComponent(
      callback
    )}&scope=${SCOPES}`;
  }

  async userInfo(kintoClient, provider, accessToken) {
    const {
      capabilities: { openid: { providers } }
    } = await kintoClient.fetchServerInfo();
    const { userinfo_endpoint: userinfoEndpoint } = providers.filter(
      ({ name }) => name === provider
    )[0];
    const resp = await fetch(userinfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return await resp.json();
  }

  parseHash() {
    const hash = decodeURIComponent(window.location.hash);
    // Parse tokens from location bar.
    const hashExtract = /provider=(\w+)&tokens=([.\s\S]*)/m.exec(hash);
    if (hashExtract) {
      const provider = hashExtract[1];
      const tokens = hashExtract[2];
      const parsed = JSON.parse(tokens);
      // If parsed info is not access token, raise.
      if (!parsed.access_token) {
        throw new Error(`Authentication error: ${tokens}`);
      }

      const idTokenPayload = JSON.parse(
        window.atob(parsed.id_token.split(".")[1])
      );
      return {
        provider,
        expiresIn: parsed.expires_in,
        accessToken: parsed.access_token,
        tokenType: parsed.token_type,
        idToken: parsed.id_token,
        idTokenPayload
      };
    }
    return null;
  }

  authenticate() {
    let authResult = null;
    try {
      authResult = this.parseHash();
    } catch (err) {
      // Authentication returned an error.
      throw err;
      // showError(err);
    }

    if (authResult && authResult.accessToken && authResult.idToken) {
      // Token was passed in location hash by authentication portal.
      // Set the time that the access token will expire at
      const expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      sessionStorage.setItem("session", JSON.stringify(authResult));
      sessionStorage.setItem("expires_at", expiresAt);
    } else {
      // Look into session storage for session.
      const expiresAt = JSON.parse(sessionStorage.getItem("expires_at"));
      // Check whether the current time is past the access token's expiry time
      if (new Date().getTime() < expiresAt) {
        authResult = JSON.parse(sessionStorage.getItem("session"));
      }
    }
    return authResult;
  }

  logout() {
    // Remove tokens and expiry time from sessionStorage
    sessionStorage.removeItem("session");
    sessionStorage.removeItem("expires_at");
  }
}
