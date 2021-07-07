/* */
'use strict';

let a = {
  nick: "",
  token: "",
  cols: 0,
  rows: 0,
  grid: [],
  x: 0,
  y: 0,
  updateGameData: function (data) {
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
