/* */
'use strict';

let a = {
  nick: "",
  token: "",
  gameOver: false,
  turn: 0,
  entities: [],
  map: {},
  history: [],
};

function updateA(data) {
  a = data;
}

const conf = {
  mode: "production",
  apiUrlBase: "",
};

conf.apiUrlBase = function () {
  //console.log(conf);
  if (conf.mode === "dev") {
    return "http://localhost:3000";
  } else {
    return "https://roguelike.online/api/v0";
  }
}();

export {
  conf,
  a,
  updateA,
};

/*
use localhost
with 127.0.0.1 cant see cookies value
*/
