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
  manhattanDistance: function (p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.max(Math.abs(dx), Math.abs(dy));
  },
  movementActionToIncreases: function (action) {
    const diff = new Point(0, 0);
    switch (action) {
      case "UPLEFT":
        diff.x -= 1;
        diff.y -= 1;
        break;
      case "UP":
        diff.y -= 1;
        break;
      case "UPRIGHT":
        diff.x += 1;
        diff.y -= 1;
        break;
      case "RIGHT":
        diff.x += 1;
        break;
      case "DOWNRIGHT":
        diff.x += 1;
        diff.y += 1;
        break;
      case "DOWN":
        diff.y += 1;
        break;
      case "DOWNLEFT":
        diff.x -= 1;
        diff.y += 1;
        break;
      case "LEFT":
        diff.x -= 1;
        break;
      default:
        break;
    }
    return diff;
  },
  randomAction: function () {
    const randomAction =
      ["UPLEFT", "UP", "UPRIGHT", "RIGHT", "DOWNRIGHT", "DOWN", "DOWNLEFT", "LEFT", "SKIP", "SKIP", "SKIP", "SKIP", "SKIP", "SKIP", "SKIP", "SKIP"];
    return randomAction[this.randomInt(0, randomAction.length - 1)];
  },
  shuffleArray: function (a) {
    for (let i = a.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
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
