/* */

console.log('Loading..... /core/action_move.js');

import { point } from "./point.js";
import { aux } from "./aux.js";

const movement = function (e, es, map, action) {
  const pos = e.components.position;
  const target = aux.getTargetMove(action, pos);
  if (map[target.x][target.y].walkable) {
    const p = point.new(target.x, target.y);
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
