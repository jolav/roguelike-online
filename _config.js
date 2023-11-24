/* */

console.log('Loading....._config.js');

let K = {
  VERSION: "0.0.2",
  // MapGen
  FONT: "PressStart2P",
  MAX_ROOMS: 20,
  COLS: 70,
  ROWS: 7,
  // Render
  CANVAS_NAME: "canvas",
  PPP: 24,
  WINDOW_WIDTH: window.innerWidth - 200,
  WINDOW_HEIGHT: window.innerHeight - 5,
  // Game
  INIT_DATE: new Date("2097-08-29 02:14:00"),
};

(function autoUpdateK() {
  K.WINDOW_WIDTH = Math.floor(K.WINDOW_WIDTH / K.PPP) * K.PPP;
  K.WINDOW_HEIGHT = Math.floor(K.WINDOW_HEIGHT / K.PPP) * K.PPP;
  K.COLS = K.WINDOW_WIDTH / K.PPP;
  K.ROWS = K.WINDOW_HEIGHT / K.PPP;
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

