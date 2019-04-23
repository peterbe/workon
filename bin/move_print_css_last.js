#!/usr/bin/env node
const fs = require("fs");

const htmlFile = process.argv[2];
if (!htmlFile) throw new Error("missing file argument");
let html = fs.readFileSync(htmlFile, "utf8");

const SNIPPET = '<link rel="stylesheet" media="print" href="/print.css">';
if (!html.includes(SNIPPET)) {
  throw new Error(`Expected '${SNIPPET}' in build html.`);
}
html = html.replace(SNIPPET, "");
html = html.replace("</head>", `${SNIPPET}</head>`);

fs.writeFileSync(htmlFile, html, "utf8");
