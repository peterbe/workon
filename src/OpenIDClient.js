import { formatDistance } from "date-fns/esm";

export const KINTO_URL = process.env.REACT_APP_KINTO_URL || "/v1";
const SCOPES = "openid email profile";

export class OpenIDClient {
  async authorize(provider, silent = false) {
    const { auth_path: authPath, name } = provider;
    let currentUrl = window.location.href.split("#")[0];
    const callback = `${currentUrl}#provider=${name}&tokens=`;
    let redirectUrl = `${KINTO_URL}${authPath}?callback=${encodeURIComponent(
      callback
    )}&scope=${encodeURIComponent(SCOPES)}`;
    if (silent) {
      redirectUrl += "&prompt=none";
    }
    if (redirectUrl.startsWith("/v1")) {
      // Only applicable for local development
      redirectUrl = `http://${window.location.hostname}:8888${redirectUrl}`;
    }
    // console.log("redirectUrl", redirectUrl);
    /*
    Here's why you can't use XHR to redirect...
    The URL http://localhost:8888/v1/openid/auth0/login?callback=...&prompt=none
    will respond with a HTTP response that looks like this:
      < HTTP 307 Temporary Redirect
      < Access-Control-Allow-Origin: *
      < Location: https://peterbecom.auth0.com/authorize/?...&prompt=none

    And that's not allowed if you use `fetch(url, {credentials: "include"})`.
    See spec here: https://fetch.spec.whatwg.org/#cors-protocol-and-credentials
    The reason you have to use `{credentials: "include"}` is so that the
    browser's stateful cookie with Auth0 needs to be carried or else the user
    will not be single-sign-on logged in thus not recognized.

    In the documentation for Silent Authentication at
    https://auth0.com/docs/api-auth/tutorials/silent-authentication
    they recommend using the `checkSession` function as part of auth0.js
    which uses a hidden iframe to go around this problem.
    */
    // if (silent) {
    //   try {
    //     const resp = await fetch(redirectUrl, { credentials: "include" });
    //     console.log("resp.status:", resp.status);
    //   } catch (ex) {
    //     console.warn("Fetching redirect URL failed", redirectUrl);
    //     console.error(ex.toString());
    //   }
    // } else {
    //   window.location = redirectUrl;
    // }
    window.location = redirectUrl;
  }

  async userInfo(kintoClient, provider, accessToken, refresh = false) {
    if (!refresh) {
      const cached = sessionStorage.getItem("userInfo") || null;
      if (cached) {
        return JSON.parse(cached);
      }
    }
    const {
      capabilities: {
        openid: { providers }
      }
    } = await kintoClient.fetchServerInfo();
    const { userinfo_endpoint: userinfoEndpoint } = providers.filter(
      ({ name }) => name === provider
    )[0];
    const resp = await fetch(userinfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (resp.status !== 200) {
      console.log("USER INFO RESPONSE STATUS", resp.status);
      throw new Error(`Status ${resp.status}`);
    }
    const json = await resp.json();
    sessionStorage.setItem("userInfo", JSON.stringify(json));
    return json;
  }

  parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }

  parseHash() {
    const qsh = window.location.hash.slice(1, window.location.hash.length);
    const qs = new URLSearchParams(qsh);

    if (qs.get("tokens") && qs.get("provider")) {
      const provider = qs.get("provider");
      const tokens = qs.get("tokens");
      const parsed = JSON.parse(tokens);
      if (!parsed.access_token) {
        throw new Error(`Authentication error: ${tokens}`);
      }
      const idTokenPayload = this.parseJwt(tokens);
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
    authResult = this.parseHash();

    if (authResult && authResult.accessToken && authResult.idToken) {
      // Token was passed in location hash by authentication portal.
      // Set the time that the access token will expire at
      const expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      localStorage.setItem("session", JSON.stringify(authResult));
      localStorage.setItem("expires_at", expiresAt);
    } else {
      // Look into session storage for session.
      const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
      // Check whether the current time is past the access token's expiry time
      if (new Date().getTime() < expiresAt) {
        authResult = JSON.parse(localStorage.getItem("session"));
      }
    }
    return authResult;
  }

  // Return true if the user has authenticated before.
  // Use this when your user fails the authenticate() method but might have
  // left trails to think he's logged in before without explictily
  // logging out.
  haveAuthenticated() {
    return !!(
      localStorage.getItem("expires_at") && localStorage.getItem("session")
    );
  }

  timeToRefresh(soon = false) {
    // Return true if the access token has expired (or is about to expire)
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    // 'age' in milliseconds
    let age = expiresAt - new Date().getTime();
    console.log(
      "accessToken expires in",
      formatDistance(expiresAt, new Date())
    );
    if (soon) {
      // Consider the accessToken to be expired if it's about to expire
      // in 30 minutes.
      age -= 30 * 60 * 1000;
    }
    return age < 0;
  }

  logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem("session");
    localStorage.removeItem("expires_at");
  }
}
