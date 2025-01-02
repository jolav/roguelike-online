/* */

console.log('Loading..... core/actions.js');

import { skip } from "./action_skip.js";
import { move } from "./action_move.js";
import { Random } from "../aux/random.js";
import { point } from "./point.js";

const actions = {
  ai: function (e, run) {
    const action = validActions[Random.int(0, 7)];
    const done = actions.move(e, action);
    if (!done) {
      return "SKIP";
    }
    return action;
  },
  getType: function (entityAction) {
    switch (entityAction) {
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
  getCost: function (entityAction) {
    return actionCost.get(entityAction);
  },
  skip,
  move,
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
  ["UPRIGHT", 140],
  ["UPLEFT", 140],
  ["DOWNRIGHT", 140],
  ["DOWNLEFT", 140],
  ["MOVE", 100],
  ["MELEE", 100],
  ["SKIP", 100],
  ["LOOT", 200],
  ["HEAL", 200],
  ["EAT", 200],
  ["FIRE", 100],

]);
