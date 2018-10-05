#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const CSP_TEMPLATE = `
default-src 'none';
connect-src workon.app kinto.workon.app peterbecom.auth0.com;
frame-src peterbecom.auth0.com;
img-src 'self' avatars2.githubusercontent.com https://*.googleusercontent.com;
script-src 'self'%SCRIPT_NONCES%;
style-src 'self' 'unsafe-inline';
font-src 'self' data:;
manifest-src 'self'
`.trim();

const htmlFile = process.argv[2];
if (!htmlFile) throw new Error("missing file argument");
let html = fs.readFileSync(htmlFile, "utf8");

let nonces = "";
let csp = CSP_TEMPLATE;
html.match(/<script>.*<\/script>/g).forEach(scriptTag => {
  const hash = crypto.createHash("sha256");
  hash.update(scriptTag);
  const nonce = hash.digest("hex").substring(0, 12);
  nonces += ` 'nonce-${nonce}'`;
  const newScriptTag = scriptTag.replace(
    /<script>/,
    `<script nonce="${nonce}">`
  );
  html = html.replace(scriptTag, newScriptTag);
});
csp = csp.replace(/%SCRIPT_NONCES%/, nonces);

const metatag = `
  <meta http-equiv="Content-Security-Policy" content="${csp}">
`
  .replace(/\n/g, "")
  .trim();
if (html.search(metatag) > -1)
  throw new Error("already has CSP metatag in HTML");
const anchor = '<meta charset="utf-8">';
const newHtml = html.replace(anchor, `${anchor}${metatag}`);
fs.writeFileSync(htmlFile, newHtml, "utf8");
