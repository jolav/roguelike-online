/* */
'use strict';

let a = {
  nick: "",
  token: "",
  gameOver: false,
  entities: [],
};

function updateA(data) {
  a = data;
}

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
  updateA,
};

/*
use localhost
with 127.0.0.1 cant see cookies value
*/
