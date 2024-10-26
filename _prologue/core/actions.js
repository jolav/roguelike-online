/* */

console.log('Loading..... core/actions.js');

import { skip } from "./action_skip.js";
import { move } from "./action_move.js";

const actions = {
  skip,
  move,
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
        return "move";
      case "SKIP":
        return "skip";
      case "MELEE":
        return "melee";
      default:
        return undefined;
    }
  },
};

export {
  actions
};
