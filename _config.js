/* */

console.log('Loading....._config.js');

let K = {
  VERSION: "0.0.5",
  // MapGen
  ROOM_TRIES: 5000,
  MAX_ROOMS: 50,
  MIN_SIZE_ROOM: 8,
  MAX_SIZE_ROOM: 40,
  MIN_LENGTH_CORRIDOR: 5,
  MAX_LENGTH_CORRIDOR: 20,
  CORRIDOR_ODDS: 0,
  MAP_X: 200,//43, 
  MAP_Y: 110,//25, 
  LOS_RADIUS: 50,
  // Render
  FONT: "PressStart2P",
  CANVAS_NAME: "canvas",
  PPP: 8,
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
  getColor: function (entity) {
    const color = colors.get(entity);
    return color;
  },
  getCurrentDate: function (turn) {
    return new Date(K.INIT_DATE.getTime() + 1000 * turn);
  },
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
};

const symbols = new Map([
  ["floor", 183],   // middleDot 183 or normal point 46
  ["wall", 35],     // #
  ["-", 0],
  ["player", 64],   // @
]);

const colors = new Map([
  ["player", "burlywood"],
  ["visible", "#fff"],
  ["explored", "#454545"],
]);
