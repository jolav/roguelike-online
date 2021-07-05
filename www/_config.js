/* */
'use strict';

export {
  conf
};

const conf = {
  mode: "dev",
  apiUrlBase: "",
};

conf.apiUrlBase = getapiUrlBase();

function getapiUrlBase() {
  if (conf.mode === "dev") {
    return "http://localhost:3000";
  } else {
    return "https://roguelike.online/api/v0";
  }
}

/*
use localhost
with 127.0.0.1 cant see cookies value
*/