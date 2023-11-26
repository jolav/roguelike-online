/* */

console.log('Loading....._config.js');

let K = {
  VERSION: "0.0.3",
  // MapGen
  FONT: "PressStart2P",
  MAX_ROOMS: 20,
  MAP_X: 33,//43, 
  MAP_Y: 21,//25, 
  // Render
  CANVAS_NAME: "canvas",
  PPP: 24,
  WINDOW_WIDTH: window.innerWidth - 200,
  WINDOW_HEIGHT: window.innerHeight - 5,
  CAM_X: 0,
  CAM_Y: 0,
  DELTA_X: 0,
  DELTA_Y: 0,
  // Game
  INIT_DATE: new Date("2097-08-29 02:14:00"),
};

(function autoUpdateK() {
  K.WINDOW_WIDTH = Math.floor(K.WINDOW_WIDTH / K.PPP) * K.PPP;
  K.WINDOW_HEIGHT = Math.floor(K.WINDOW_HEIGHT / K.PPP) * K.PPP;
  K.CAM_X = K.WINDOW_WIDTH / K.PPP;
  if (K.CAM_X > K.MAP_X) {   // CAMERA IS GREATER THAN MAP
    K.DELTA_X = Math.floor((K.CAM_X - K.MAP_X) / 2);
    K.CAM_X = K.MAP_X;
  }
  K.CAM_Y = K.WINDOW_HEIGHT / K.PPP;
  if (K.CAM_Y > K.MAP_Y) {   // CAMERA IS GREATER THAN MAP
    K.DELTA_Y = Math.floor((K.CAM_Y - K.MAP_Y) / 2);
    K.CAM_Y = K.MAP_Y;
  }
  //console.log(K);
})();

export {
  K,
  lib,
};

const lib = {
  getCharCode: function (symbol) {
    const charCode = symbols.get(symbol);
    const char = String.fromCharCode(charCode);
    return char;
  },
  getCurrentDate: function (turn) {
    return new Date(K.INIT_DATE.getTime() + 1000 * turn);
  }
};

const symbols = new Map([
  ["floor", 183],   // middleDot 183 or normal point 46
  ["wall", 35],     // #
  ["-", 0],
  ["player", 64],   // @
]);

