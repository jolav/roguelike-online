/* */

console.log('Loading..... /core/sys_movement.js');

import { aux } from "./aux.js";

const movement = function (r, action) {
  r.entities.forEach(function (e) {
    if (e.components.player && validMoves.includes(action)) {
      const pos = e.components.position;
      const target = getEntityTargetMove(action, pos);
      if (r.map[target.x][target.y].walkable) {
        pos.old = pos.current;
        pos.current = target;
      }
    }
  });
};

export {
  movement,
};

function getEntityTargetMove(action, pos) {
  const target = aux.newPoint(pos.current.x, pos.current.y);
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
