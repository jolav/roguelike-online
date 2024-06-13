/* */

console.log('Loading..... /core/aux.js');

import { point } from "./point.js";

const aux = {
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
  diceRoll: function (diceString) {
    const dicePattern = /^(\d+)d(\d+)([+-]\d+)?$/;
    const match = diceString.match(dicePattern);
    if (!match) {
      return undefined;
    }
    const diceQty = parseInt(match[1]);
    const dieSize = parseInt(match[2]);
    let modifier = 0;
    if (match[3]) {
      modifier = parseInt(match[3]);
    }

    let result = 0;
    for (let i = 0; i < diceQty; i++) {
      result += Math.floor(Math.random() * dieSize) + 1;
    }
    result += modifier;
    return result;
  },
  getTargetMove: function (action, pos) {
    const target = point.new(pos.current.x, pos.current.y);
    switch (action) {
      case "UPLEFT":
        target.x--;
        target.y--;
        break;
      case "UP":
        target.y--;
        break;
      case "UPRIGHT":
        target.x++;
        target.y--;
        break;
      case "RIGHT":
        target.x++;
        break;
      case "DOWNRIGHT":
        target.x++;
        target.y++;
        break;
      case "DOWN":
        target.y++;
        break;
      case "DOWNLEFT":
        target.x--;
        target.y++;
        break;
      case "LEFT":
        target.x--;
    }
    return target;
  }
};

export {
  aux,
};
