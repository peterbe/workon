export const KINTO_URL = process.env.REACT_APP_KINTO_URL || "/v1";
const SCOPES = "openid email profile";

export class OpenIDClient {
  async authorize(provider) {
    const { auth_path: authPath, name } = provider;
    const callback = `${window.location.href}#provider=${name}&tokens=`;
    // Redirect the browser to start the OAuth login dance.
    let redirectUrl = `${KINTO_URL}${authPath}?callback=${encodeURIComponent(
      callback
    )}&scope=${SCOPES}`;
    if (redirectUrl.startsWith("/v1")) {
      // Only applicable for local development
      redirectUrl = `http://${window.location.hostname}:8888${redirectUrl}`;
    }
    window.location = redirectUrl;
  }

  async userInfo(kintoClient, provider, accessToken) {
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
    return await resp.json();
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
