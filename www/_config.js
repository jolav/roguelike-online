/* */
'use strict';

let a = {
  nick: "",
  token: "",
  updateNewGameData: function (data) {
    a = data;
  }
};

const conf = {
  mode: "dev",
  apiUrlBase: "",
};

conf.apiUrlBase = function () {
  if (conf.mode === "dev") {
    return "http://localhost:3000";
  } else {
    return "https://roguelike.online/api/v0";
  }
}();

export {
  conf,
  a,
};

/*
use localhost
with 127.0.0.1 cant see cookies value
*/
