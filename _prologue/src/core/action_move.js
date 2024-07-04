/* */

console.log('Loading..... /core/action_move.js');

import { aux } from "./aux.js";

const movement = function (e, action) {
  const pos = e.components.position;
  const target = aux.getTargetMove(action, pos);
  pos.current = target;
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
