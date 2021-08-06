/* */
'use strict';

let a = {
  nick: "",
  token: "",
  gameOver: false,
  entities: [],
  map: {},
};

function updateA(data) {
  a = data;
}

function getMapSymbol(word) {
  return String.fromCharCode(symbols.get(word));
}

const symbols = new Map([
  ["floor", 183],   // middleDot
  ["wall", 35],     // #
  ["-", 0],
  ["player", 64],   // @
]);

const conf = {
  mode: "dev",
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
  getMapSymbol,
};

/*
use localhost
with 127.0.0.1 cant see cookies value
*/
