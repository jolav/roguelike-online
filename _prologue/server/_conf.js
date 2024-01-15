/* */

console.log('Loading...../server/_conf.js');

const K = {
  // general
  VERSION: "0.1.1",
  TRIES: 500,
  DEV: "localhost",
  // turn
  ACTION: undefined,
  SELECTED: undefined,
  MS_PER_TURN: 1000,
  // Render
  CAM_COLS: undefined,
  CAM_ROWS: undefined,
  // Map
  MAX_ROOMS: 100,
  MIN_SIZE_ROOM: 4,
  MAX_SIZE_ROOM: 12,
  MIN_LENGTH_CORRIDOR: 5,
  MAX_LENGTH_CORRIDOR: 20,
  CORRIDOR_ODDS: 0,
  MAP_COLS: 116,//39,
  MAP_ROWS: 72,//24,
  // Player
  LOS_RANGE: 15,
  // Npc
  MAX_NPCS: 60,
  MAX_ITEMS: 150,
};

export {
  K,
  lib,
};

const lib = {
  sleep: function (ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
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
      ["UP", "DOWN", "LEFT", "RIGHT", "SKIP", "SKIP", "SKIP", "SKIP"];
    return randomAction[this.randomInt(0, 7)];
  },
  initializeMultiArray: function (cols, rows, value) {
    let array = [];
    for (let i = 0; i < cols; i++) {
      array[i] = [];
      for (let j = 0; j < rows; j++) {
        array[i][j] = value;
      }
    }
    return array;
  },
  Point: function (x, y) {
    this.x = x;
    this.y = y;
  },
  euclideanDistance: function (p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  diagonalDistance: function (p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.max(Math.abs(dx), Math.abs(dy));
  },
  shuffleArray: function (a) {
    for (let i = a.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
  },
  niceLog: function (o) {
    return JSON.stringify(o, null, 2);
  }
};

