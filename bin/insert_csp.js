#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

const CSP_TEMPLATE = `
default-src 'none';
connect-src 'self' kinto.workon.app peterbecom.auth0.com;
frame-src peterbecom.auth0.com;
img-src 'self' https://avatars*.githubusercontent.com https://*.googleusercontent.com;
script-src 'self'%SCRIPT_HASHES%;
style-src 'self' 'unsafe-inline';
font-src 'self' data:;
manifest-src 'self'
`.trim();

const htmlFile = process.argv[2];
if (!htmlFile) throw new Error("missing file argument");
let html = fs.readFileSync(htmlFile, "utf8");

let hashes = "";
let csp = CSP_TEMPLATE;
const matches = html.match(/<script>.*<\/script>/g);
if (matches) {
  matches.forEach((scriptTag) => {
    const hash = crypto.createHash("sha256");
    hash.update(scriptTag.replace(/<script>/, "").replace("</script>", ""));
    const digest = hash.digest("hex");
    hashes += ` 'sha256-${digest.toString("base64")}'`;
  });
}
csp = csp.replace(/%SCRIPT_HASHES%/, hashes);

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
