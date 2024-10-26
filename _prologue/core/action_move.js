/* */

console.log('Loading..... core/action_move.js');

import { point } from "./point.js";
import { run } from "./run.js";

const move = function (e, action) {
  const pos = e.components.Position;
  const target = getTargetMove(action, pos.current);
  if (!canMove(e, target)) {
    return false;
  }
  console.log(`Entitie ${e.id} moving`);
  pos.current = target;
  return true;
};

export {
  move,
};

function canMove(e, target) {
  const es = run.entities;
  const map = run.map;
  if (point.isWalkable(target, map)) {
    if (point.isEmpty(target, es)) {
      return true;
    }
  }
  return false;
}

function getTargetMove(action, pos) {
  const target = point.new(pos.x, pos.y);
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
