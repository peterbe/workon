export const KINTO_URL =
  process.env.REACT_APP_KINTO_URL || "http://localhost:8888/v1";
const SCOPES = "openid email";

export class OpenIDClient {
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
