/* */

import { _config } from "./_private.js";
import os from "os";

//import packageJSON from './package.json' with { type: 'json' };
import { readFileSync } from "fs";
const packageJSON = JSON.parse(readFileSync("./package.json"));

const K = {
  "version": packageJSON.version,
  "name": packageJSON.name,
  "mode": "dev",
  "port": 3000,
  "tick": 600,
  "tries": 1000,
};

function checkMode() {
  const serverName = os.hostname().toLowerCase();

  if (!_config.devHosts.includes(serverName)) {
    K.mode = _config.mode;
    K.port = _config.port;
  }
  K.tick = _config.tick;
}

checkMode();
if (K.mode === "dev") {
  console.log(K);
}

export {
  K
};
