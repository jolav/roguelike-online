/* */

console.log('Loading...../server/api.js');

import { K, lib } from "./_conf.js";
import { r } from "./run.js";

const data = {
  version: K.VERSION,
  msPerTurn: K.MS_PER_TURN,
  pj: undefined,
  turn: undefined,
  view: [],
  cam: {
    x: 0,
    y: 0
  },
  receivedFromClient: function (action, cam) {
    K.ACTION = action;
    K.CAM_COLS = cam.cols;
    K.CAM_ROWS = cam.rows;
    if (cam.cols > K.MAP_COLS) {
      K.CAM_COLS = K.MAP_COLS;
    }
    if (cam.rows > K.MAP_ROWS) {
      K.CAM_ROWS = K.MAP_ROWS;
    }
  },
  prepareForClient: function () {
    data.pj = r.pj;
    data.turn = r.turn;
    data.updateView();
  },
  updateView: function () {
    let x = r.pj.pos.x - Math.floor(K.CAM_COLS / 2);
    let y = r.pj.pos.y - Math.floor(K.CAM_ROWS / 2);
    if (x < 0) {
      x = 0;
    } else if (x > K.MAP_COLS - K.CAM_COLS) {
      x = K.MAP_COLS - K.CAM_COLS;
    }
    if (y < 0) {
      y = 0;
    } else if (y > K.MAP_ROWS - K.CAM_ROWS) {
      y = K.MAP_ROWS - K.CAM_ROWS;
    }
    this.cam = { x, y };
    const view = lib.initializeMultiArray(K.CAM_COLS, K.CAM_ROWS, {});
    for (let col = 0; col < K.CAM_COLS; col++) {
      for (let row = 0; row < K.CAM_ROWS; row++) {
        view[col][row] = r.map[x + col][y + row];
      }
    }
    this.view = view;
  }
};

const api = {
  version: function () {
    return data.version;
  },
  run: function (cam) {
    data.receivedFromClient(undefined, cam);
    r.start();
    data.prepareForClient();
    //console.log(data.view[0][0]);
    return data;
  },
  turn: function (action, cam) {
    data.receivedFromClient(action, cam);
    r.oneMoreTurn();
    data.prepareForClient();
    //console.log(JSON.stringify(data, null, 2));
    return data;
  }
};

export {
  api,
};

