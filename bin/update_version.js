#!/usr/bin/env node
const fs = require("fs");
const spawn = require("child_process").spawnSync;

const package = require("../package.json");
const name = package.name;

const spawnStr = (cmd, ...args) => {
  const spawned = spawn(cmd, ...args);
  return spawned.stdout.toString().trim();
};
const version = spawnStr("git", ["describe", "--always", "--tag"]);

const commitRaw = spawnStr("git", ["log", "--pretty=format:'%H'", "-n", "1"]);
const commit = commitRaw.slice(1, commitRaw.length - 1);

console.log(
  JSON.stringify(
    {
      name,
      version,
      commit
    },
    undefined,
    2
  )
);
