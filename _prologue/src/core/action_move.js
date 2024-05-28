/* */

console.log('Loading..... /core/action_move.js');

import { aux } from "./aux.js";

const movement = function (e, map, action) {
  const pos = e.components.position;
  const target = getEntityTargetMove(action, pos);
  if (map[target.x][target.y].walkable) {
    pos.old = pos.current;
    pos.current = target;
    return true;
  }
  return false;
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

