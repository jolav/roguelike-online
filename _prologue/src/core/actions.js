/* */

console.log('Loading..... /core/actions.js');

import { movement } from "./action_move.js";
import { skip } from "./action_skip.js";
import { aux } from "./aux.js";

const actions = {
  ai: function (e, map) {
    const action = validMoves[aux.randomInt(0, 7)]
    const type = this.getType(action)
    if (!e.components.movable) {
      return ["skip", "skip"]
    }
    return [type, action]
  },
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
  cost: function (action) {
    return actionCost.get(action);
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

const actionCost = new Map([
  ["UP", 100],
  ["DOWN", 100],
  ["LEFT", 100],
  ["RIGHT", 100],
  ["UPRIGHT", 100],
  ["UPLEFT", 100],
  ["DOWNRIGHT", 100],
  ["DOWNLEFT", 100],
  ["MELEE", 100],
  ["SKIP", 100],
  ["LOOT", 200],
  ["HEAL", 200],
  ["EAT", 200],
  ["FIRE", 100],

]);

const validMoves = [
  "UP",
  "DOWN",
  "LEFT",
  "RIGHT",
  "UPRIGHT",
  "UPLEFT",
  "DOWNRIGHT",
  "DOWNLEFT",
];

