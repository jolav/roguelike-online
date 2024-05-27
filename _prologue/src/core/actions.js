/* */

console.log('Loading..... /core/actions.js');

import { movement } from "./action_move.js";
import { skip } from "./action_skip.js";

const actions = {
  getType: function (action) {
    switch (action) {
      case "UP":
      case "DOWN":
      case "LEFT":
      case "RIGHT":
      case "UPLEFT":
      case "UPRIGHT":
      case "DOWNRIGHT":
      case "DOWNLEFT":
        return "movement";
      case "SKIP":
        return "skip";
      default:
        return "none";
    }
  },
  movement,
  skip,
};

export {
  actions
};

const validActions = [
  "UP",
  "DOWN",
  "LEFT",
  "RIGHT",
  "UPRIGHT",
  "UPLEFT",
  "DOWNRIGHT",
  "DOWNLEFT",
  "MELEE",
  "SKIP",
  "LOOT",
  "HEAL",
  "EAT",
  "FIRE",
];
