/* */

console.log('Loading...../core/api.js');

import { K } from "./_konfig.js";
import { r } from "./run.js";
import { Point } from "./utils.js";
import { utils as u } from "./utils.js";

const api = {
  version: function () {
    const version = { version: K.VERSION };
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
    return aux.prepareDataForClient();
  }
};

const aux = {
  prepareDataForClient: function () {
    let data = {
      version: K.VERSION,
      nick: r.nick,
      token: r.token,
      counter: r.counter,
      turn: r.turn,
      cam: r.cam,
      pj: this.updatePJ(r.pj, r.cam),
      view: this.updateView(r.map, r.cam),
    };
    return data;
  },
  updateView: function (map, cam) {
    const view = u.initializeMultiArray(K.CAM_COLS, K.CAM_ROWS, {});
    for (let col = 0; col < K.CAM_COLS; col++) {
      for (let row = 0; row < K.CAM_ROWS; row++) {
        view[col][row] = map[cam.x + col][cam.y + row];
      }
    }
    return view;
  },
  updatePJ: function (pj, cam) {
    pj.view = new Point(pj.pos.x - cam.x, pj.pos.y - cam.y);
    return pj;
  }
};

export {
  api,
};

