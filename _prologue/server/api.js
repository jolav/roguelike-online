/* */

console.log('Loading...../server/api.js');

import { K, lib } from "./_conf.js";
import { r } from "./run.js";
import { entities } from "./entities.js";

const api = {
  version: function () {
    return data.version;
  },
  run: function (cam) {
    data.receivedFromClient(undefined, cam);
    r.start();
    data.prepareForClient();
    return data;
  },
  turn: function (action, cam, selected) {
    data.receivedFromClient(action, cam, selected);
    r.oneMoreTurn();
    data.prepareForClient();
    return data;
  }
};

const data = {
  version: K.VERSION,
  msPerTurn: K.MS_PER_TURN,
  pj: undefined,
  turn: undefined,
  view: [],
  npcs: [],
  items: [],
  history: [],
  gameOver: r.gameOver,
  cam: r.cam,
  receivedFromClient: function (action, cam, selected) {
    //Only for dev make map same size as browser actual size
    if (window.location.hostname === K.DEV) {
      K.MAP_COLS = cam.cols;
      K.MAP_ROWS = cam.rows;
    }
    //-------------------------------------------------------
    K.ACTION = action;
    K.CAM_COLS = cam.cols;
    K.CAM_ROWS = cam.rows;
    K.ID_SELECTED = selected;
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
    data.npcs = data.updateNpcs();
    data.history = r.history;
    data.items = data.updateItems();
    data.gameOver = r.gameOver;
  },
  updateView: function () {
    const view = lib.initializeMultiArray(K.CAM_COLS, K.CAM_ROWS, {});
    for (let col = 0; col < K.CAM_COLS; col++) {
      for (let row = 0; row < K.CAM_ROWS; row++) {
        view[col][row] = r.map[this.cam.x + col][this.cam.y + row];
      }
    }
    return view;
  },
  updateNpcs: function () {
    let result = [];
    for (let col = 0; col < K.CAM_COLS; col++) {
      for (let row = 0; row < K.CAM_ROWS; row++) {
        const candidates = entities.atPoint({
          x: this.cam.x + col,
          y: this.cam.y + row,
        }, r.npcs
        );
        if (candidates.length === 1) {
          const tile = r.map[candidates[0].pos.x][candidates[0].pos.y];
          if (tile.visible) {
            result.push(candidates[0]);
          }
        } else if (candidates.length > 1) { // corpses
          const tile = r.map[candidates[0].pos.x][candidates[0].pos.y];
          if (tile.visible) {
            for (let c of candidates) {
              result.push(c);
            }
          }
        }
      }
    }
    return result;
  },
  updateItems: function () {
    const result = [];
    for (let col = 0; col < K.CAM_COLS; col++) {
      for (let row = 0; row < K.CAM_ROWS; row++) {
        const candidates = entities.atPoint({
          x: this.cam.x + col,
          y: this.cam.y + row,
        }, r.items
        );
        if (candidates.length === 1) {
          const tile = r.map[candidates[0].pos.x][candidates[0].pos.y];
          if (tile.visible) {
            result.push(candidates[0]);
          }
        } else if (candidates.length > 1) {
          //console.log('ALERT, ALERT', candidates);
        }
      }
    }
    return result;
  }
};

export {
  api,
};

