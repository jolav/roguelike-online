/* */

console.log('Loading..... /core/action_move.js');

import { point } from "./point.js";

const movement = function (e, es, map, action) {
  const pos = e.components.position;
  const target = getTargetMove(action, pos);
  if (map[target.x][target.y].walkable) {
    const p = point.new(target.x, target.y)
    if (point.canEnter(p, es)) {
      pos.old = pos.current;
      pos.current = target;
      return true;
    }
  }
  return false;
};

export {
  movement,
};

function getTargetMove(action, pos) {
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

