/* */

console.log('Loading....._config.js');

const C = {
  VERSION: 0,
  MS_PER_TURN: 0,
  INDEX_SELECTED: undefined,
  ID_SELECTED: undefined,
  NPC_SELECTED: undefined,
  // Render
  RENDER_TYPE: 0, // 0 = ASCII
  CANVAS_NAME: "canvas",
  PPP: 24,
  FPS: 60,
  ANIMATION_SPEED: 2,
  FONT: ["sans-serif", "VarelaRound", "NotoSansMonoMedium"],
  // Camera dimensions
  CAM_PIXELS_X: window.innerWidth - 300,
  CAM_PIXELS_Y: window.innerHeight - 15,
  CAM_COLS: undefined,
  CAM_ROWS: undefined,
  CAM_DELTA_X: undefined,
  CAM_DELTA_Y: undefined,
  // Game
  INIT_DATE: new Date("2097-08-29 02:14:00"),
};

(function autoUpdateC() {
  C.CAM_COLS = Math.floor(C.CAM_PIXELS_X / C.PPP);
  C.CAM_ROWS = Math.floor(C.CAM_PIXELS_Y / C.PPP);
  C.CAM_DELTA_X = Math.floor((C.CAM_PIXELS_X - (C.CAM_COLS * C.PPP)) / 2);
  C.CAM_DELTA_Y = Math.floor((C.CAM_PIXELS_Y - (C.CAM_ROWS * C.PPP)) / 2);
  //console.log(JSON.stringify(C, null, 2));
})();

const lib = {
  sleep: function (ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  },
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  currentDate: function (turn) {
    return new Date(C.INIT_DATE.getTime() + C.MS_PER_TURN * turn);
  },
  atPoint: function (p, es) {
    let resp = [];
    for (let e of es) {
      if (e.pos.x === p.x && e.pos.y === p.y) {
        resp.push(e);
      }
    }
    return resp;
  },
};

export {
  C,
  lib,
};

