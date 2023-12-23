/* */

console.log('Loading...../server/api.js');

import { K } from "./_conf.js";
import { r } from "./run.js";

const data = {
  version: K.VERSION,
  msPerTurn: K.MS_PER_TURN,
  pj: undefined,
  turn: undefined,
};

const api = {
  version: function () {
    return data.version;
  },
  run: function () {
    r.start();
    newRun();
    return data;
  },
  turn: function (action) {
    r.oneMoreTurn(action);
    updateTurn();
    //console.log(JSON.stringify(data, null, 2));
    return data;
  }
};

function newRun() {
  data.pj = r.pj;
  data.turn = r.turn;
}

function updateTurn() {
  data.pj = r.pj;
  data.turn = r.turn;
}

export {
  api,
};

