/* */

console.log('Loading...../core/utils.js');

import { K } from "./_konfig.js";

const utils = {
  randomNick: async function () {
    let nick = this.randomNick2(5, 2);
    const resp = await fetch(K.SURNAME_TXT);
    if (!resp.ok) {
      return nick;
    }
    const txt = await resp.text();
    const lines = txt.split("\n");
    nick = lines[this.randomInt(0, lines.length - 1)];
    return nick;
  },
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  randomNick2: async function (nameLength, numbersLength) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
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
  Point: function (x, y) {
    this.x = x;
    this.y = y;
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
};

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export {
  utils,
  Point,
};
