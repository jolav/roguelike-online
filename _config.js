/* */

console.log('Loading....._config.js');

let K = {
  VERSION: "0.1.0",
  // MapGen
  ROOM_TRIES: 5000,
  MAX_ROOMS: 100,
  MIN_SIZE_ROOM: 4,
  MAX_SIZE_ROOM: 12,
  MIN_LENGTH_CORRIDOR: 5,
  MAX_LENGTH_CORRIDOR: 20,
  CORRIDOR_ODDS: 0,
  MAP_X: 143,//43, 
  MAP_Y: 125,//25, 
  LOS_RADIUS: 16,
  // Render
  FONT: "VarelaRound",//"NotoSansMonoMedium",
  CANVAS_NAME: "canvas",
  PPP: 20,
  WINDOW_WIDTH: window.innerWidth - 200,
  WINDOW_HEIGHT: window.innerHeight - 5,
  CAM_X: 0,
  CAM_Y: 0,
  DELTA_X: 0,
  DELTA_Y: 0,
  // Foes
  FOES_TRIES: 1000, //K.ROOM_TRIES,
  MAX_FOES: 50,//K.MAX_ROOMS,
  ITEMS_TRIES: 1000,
  MAX_ITEMS: 120,
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

  mapSymbol: function (symbol) {
    if (symbol.slice(0, 9) === "corpse of") {
      return String.fromCharCode(symbols.get(symbol.slice(0, 9)));
    }
    return String.fromCharCode(symbols.get(symbol));
  },
  colorOfEntity: function (entity) {
    const color = colors.get(entity);
    return color;
  },
  currentDate: function (turn) {
    return new Date(K.INIT_DATE.getTime() + 1000 * turn);
  },
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  randomNick: function (nameLength, numbersLength) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    let nick = "";
    for (let i = 0; i < nameLength; i++) {
      nick += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    for (let i = 0; i < numbersLength; i++) {
      nick += nums.charAt(Math.floor(Math.random() * nums.length));
    }
    return nick;
  },
  randomString: function (length) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      randomString += chars.charAt(randomIndex);
    }
    return randomString;
  },
  randomAction: function () {
    const randomAction =
      ["up", "down", "left", "right", "skip", "skip", "skip", "skip"];
    return randomAction[this.randomInt(0, 7)];
  },
  pointsDistance: function (p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  entitiesDistance: function (x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  },
  shuffleArray: function (a) {
    for (let i = a.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
  }
};

const symbols = new Map([
  ["floor", 183],   // middleDot 183 or normal point 46
  ["wall", 35],     // #
  ["-", 0],
  ["player", 64],   // @ 
  ["rat", 114],     // r
  ["mole rat", 82], // R
  ["corpse of", 37],    // %  
  ["item", 63],    // ?
  ["exit", 60], // <
]);

const colors = new Map([
  ["player", "burlywood"],
  ["visible", "#fff"],
  ["explored", "#454545"],
  ["rat", "DeepPink"],
  ["mole rat", "DeepPink"],
  ["item", "orange"],
  ["exit", "yellow"]
]);
