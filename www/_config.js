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
  apiUrlBase: "https://roguelike.online/api/v0",
};

(function autoUpdateConf() {
  if (window.location.hostname === "localhost") {
    conf.mode = "dev"
    conf.apiUrlBase = "http://localhost:3000"
  }
})();


export {
  conf,
  a,
  updateA,
};

/*
use localhost
with 127.0.0.1 cant see cookies value
*/
