/* */

import { _config } from "./_private.js";
import os from "os";

//import packageJSON from './package.json' with { type: 'json' };
import { readFileSync } from "fs";
const packageJSON = JSON.parse(readFileSync("./package.json"));

const config = {
  "version": packageJSON.version,
  "name": packageJSON.name,
  "mode": "dev",
  "port": 3000,
  "tick": 600,
};

function checkMode() {
  const serverName = os.hostname().toLowerCase();

  if (!_config.devHosts.includes(serverName)) {
    config.mode = _config.mode;
    config.port = _config.port;
  }
  config.tick = _config.tick;
}

checkMode();
if (config.mode === "dev") {
  console.log(config);
}

export {
  config
};
