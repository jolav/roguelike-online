/* */

console.log('Loading..... /core/actions.js');

import { melee } from "./action_melee.js";
import { movement } from "./action_move.js";
import { skip } from "./action_skip.js";
import { aux } from "./aux.js";
import { point } from "./point.js";

const actions = {
  ai: function (e, es, map, playerID) {
    if (!e.components.movable) {
      return "SKIP";
    }
    const pj = es[playerID];
    // default action skip
    if (!inPlayerLOS(map, e, pj)) {
      if (!e.components.movable) {
        return "SKIP";
      }
      const action = validActions[aux.randomInt(0, 7)];
      if (point.canMove(e, es, map, action)) {
        this.movement(e, action);
        return action;
      }
      return "SKIP";
    }
    return this.assaultMove(e, es, map, pj);
  },
  assaultMove: function (e, es, map, pj) {
    pj.pos = pj.components.position.current;
    e.pos = e.components.position.current;

    if (aux.euclideanDistance(pj.pos, e.pos) < 1.5) {
      //console.log('Melee ', e.id, " -> ", pj.id);
      actions.melee(e, pj);
      return "MELEE";
    }
    const options = [];

    const left =
      aux.euclideanDistance(pj.pos, { x: e.pos.x - 1, y: e.pos.y });
    options.push(["LEFT", left]);
    const right =
      aux.euclideanDistance(pj.pos, { x: e.pos.x + 1, y: e.pos.y });
    options.push(["RIGHT", right]);
    const up =
      aux.euclideanDistance(pj.pos, { x: e.pos.x, y: e.pos.y - 1 });
    options.push(["UP", up]);
    const down =
      aux.euclideanDistance(pj.pos, { x: e.pos.x, y: e.pos.y + 1 });
    options.push(["DOWN", down]);
    const downLeft =
      aux.euclideanDistance(pj.pos, { x: e.pos.x - 1, y: e.pos.y + 1 });
    options.push(["DOWNLEFT", downLeft]);
    const downRight =
      aux.euclideanDistance(pj.pos, { x: e.pos.x + 1, y: e.pos.y + 1 });
    options.push(["DOWNRIGHT", downRight]);
    const upLeft =
      aux.euclideanDistance(pj.pos, { x: e.pos.x - 1, y: e.pos.y - 1 });
    options.push(["UPLEFT", upLeft]);
    const upRight =
      aux.euclideanDistance(pj.pos, { x: e.pos.x + 1, y: e.pos.y - 1 });
    options.push(["UPRIGHT", upRight]);

    options.sort(function (a, b) {
      return a[1] - b[1];
    });

    //console.log(options);
    for (let o of options) {
      if (point.canMove(e, es, map, o[0])) {
        this.movement(e, o[0]);
        return o[0];
      }
    }
    return "SKIP"; // skip cost

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
      case "MELEE":
        return "melee";
      default:
        return undefined;
    }
  },
  cost: function (action) {
    return actionCost.get(action);
  },
  skip,
  movement,
  melee,
};

function inPlayerLOS(map, e, pj) {
  const ePos = e.components.position.current;
  const pjPos = pj.components.position.current;
  if (!map[ePos.x][ePos.y].visible) {
    return false;
  }
  const distanceToPlayer = aux.euclideanDistance(ePos, pjPos);
  return distanceToPlayer <= 20 - 2;//this.combat.los;
}

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
  ["MOVEMENT", 100],
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
