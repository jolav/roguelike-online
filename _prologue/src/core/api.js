/* */

console.log('Loading..... /core/api.js');

import { K } from "./_konfig.js";
import { r } from "./run.js";
import { point } from "./point.js";
import { aux } from "./aux.js";

const api = {
  version: function () {
    return K.VERSION;
  },
  turn: async function (params) {
    //console.log('TURN PARAMS => ', params);
    adjustViewToMap(params);
    if (params.action === "new") {
      await r.start();
    } else {
      r.turnLoop(params);
    }
    return clientData.prepare(r);
  }
};

export {
  api
};

function adjustViewToMap(params) {
  K.VIEW_COLS = params.cols;
  K.VIEW_ROWS = params.rows;
  if (K.TYPE_OF_MAP === 1) {
    if (K.VIEW_COLS > K.MAP_COLS) { // map smaller than view
      K.VIEW_COLS = K.MAP_COLS;
    }
    if (K.VIEW_ROWS > K.MAP_ROWS) { // map smaller than view
      K.VIEW_ROWS = K.MAP_ROWS;
    }
  }
}

const clientData = {
  prepare: function (r) {
    //console.log(r.map.length, r.map[0].length);
    const cd = {
      turn: r.turn,
      entities: this.updateEntities(r.entities, r.map, r.cam),
      view: this.updateView(r.map, r.cam)
    };
    return cd;
  },
  updateEntities: function (es, map, cam) {
    const result = [];
    for (let e of es) {
      if (!e.components.renderable) {
        continue
      }
      const pos = e.components.position.current;
      if (map[pos.x][pos.y].visible) {
        e.view = point.new(pos.x - cam.x, pos.y - cam.y);
        result.push(e);
      }
    }
    return result;
  },
  updateView: function (map, cam) {
    const view = aux.initializeMultiArray(K.VIEW_COLS, K.VIEW_ROWS, {});
    for (let col = 0; col < K.VIEW_COLS; col++) {
      for (let row = 0; row < K.VIEW_ROWS; row++) {
        view[col][row] = map[cam.x + col][cam.y + row];
      }
    }
    return view;
  }
};
