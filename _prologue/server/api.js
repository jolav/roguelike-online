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
  run: function (cam) {
    r.start();
    prepareDataForTheClient(cam);
    return data;
  },
  turn: function (action, cam) {
    r.oneMoreTurn(action);
    prepareDataForTheClient(cam);
    //console.log(JSON.stringify(data, null, 2));
    return data;
  }
};

function prepareDataForTheClient(cam) {
  data.pj = r.pj;
  data.turn = r.turn;
  data.map = r.map;
}

export {
  api,
};

