/* */

console.log('Loading...../core/api.js');

import { K, lib } from "./_konfig.js";
import { r } from "./run.js";
import { Point } from "./utils.js";

const api = {
  version: function () {
    const version = { version: dataRun.version };
    return version;
  },
  turn: async function (params) {
    K.CAM_COLS = params.cam.split("_")[0];
    K.CAM_ROWS = params.cam.split("_")[1];
    if (K.TYPE_OF_MAP === 1) {
      if (K.CAM_COLS > K.MAP_COLS) { // map smaller than view
        K.CAM_COLS = K.MAP_COLS;
      }
      if (K.CAM_ROWS > K.MAP_ROWS) { // map smaller than view
        K.CAM_ROWS = K.MAP_ROWS;
      }
    }
    if (params.action === "new") {
      await r.start();
    } else {
      r.oneMoreTurn(params.action);
    }
    prepareDataForClient();
    return dataRun;
  }
};

let dataRun = {
  version: K.VERSION,
  nick: r.nick,
  token: r.token,
};

function prepareDataForClient() {
  dataRun = {
    version: K.VERSION,
    nick: r.nick,
    token: r.token,
    counter: r.counter,
    turn: r.turn,
    cam: r.cam,
    pj: aux.updatePJ(),
    view: aux.updateView(),
  };
}

const aux = {
  updateView: function () {
    const view = lib.initializeMultiArray(K.CAM_COLS, K.CAM_ROWS, {});
    //console.log(K.CAM_COLS, K.CAM_ROWS);
    for (let col = 0; col < K.CAM_COLS; col++) {
      for (let row = 0; row < K.CAM_ROWS; row++) {
        //try {
        view[col][row] = r.map[r.cam.x + col][r.cam.y + row];
        //} catch (err) {
        //console.log('Error =>', col, row);
        //}
      }
    }
    return view;
  },
  updatePJ: function () {
    r.pj.view = new Point(r.pj.pos.x - r.cam.x, r.pj.pos.y - r.cam.y);
    return r.pj;
  }
};

export {
  api,
};

