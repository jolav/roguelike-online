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
  cam: r.cam,
  receivedFromClient: function (action, cam) {
    //Only for test make map same size as browser actual size
    if (window.location.hostname === "localhost") {
      K.MAP_COLS = cam.cols;
      K.MAP_ROWS = cam.rows;
    }
    //
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
    data.cam = r.cam;
    data.view = data.updateView();
  },
  updateView: function () {
    const view = lib.initializeMultiArray(K.CAM_COLS, K.CAM_ROWS, {});
    for (let col = 0; col < K.CAM_COLS; col++) {
      for (let row = 0; row < K.CAM_ROWS; row++) {
        view[col][row] = r.map[this.cam.x + col][this.cam.y + row];
      }
    }
    return view;
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

