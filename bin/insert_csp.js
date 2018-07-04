#!/usr/bin/env node
const fs = require("fs");
const spawn = require("child_process").spawnSync;

const CSP = `
default-src 'none';
connect-src  kinto.workon.app peterbecom.auth0.com;
img-src 'self' avatars2.githubusercontent.com https://*.googleusercontent.com;
script-src 'self';
style-src 'self' 'unsafe-inline';
font-src 'self' data:;
manifest-src 'self'
`.trim();

const htmlFile = process.argv[2];
if (!htmlFile) throw new Error("missing file argument");
const html = fs.readFileSync(htmlFile, "utf8");
const metatag = `
  <meta http-equiv="Content-Security-Policy" content="${CSP}">
`
  .replace(/\n/g, "")
  .trim();
if (html.search(metatag) > -1) throw new Error("already has metatag in HTML");
const anchor = '<meta charset="utf-8">';
const newHtml = html.replace(anchor, `${anchor}${metatag}`);
fs.writeFileSync(htmlFile, newHtml, "utf8");
