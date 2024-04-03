/* */

console.log('Loading...../core/entity.js');

import { K } from "./_konfig.js";
import { utils as u } from "./utils.js";
import { Point } from "./utils.js";
import { r } from "./run.js";

function createEntity(id) {
  return new Entity(id);
}

class Entity {
  constructor(id) {
    this.id = id;
    const x = Math.floor(K.CAM_COLS / 2);
    const y = Math.floor(K.CAM_ROWS / 2);
    this.pos = new Point(x, y);
    this.view = new Point(x, y);
  }
  move(action) {
    const target = new Point(this.pos.x, this.pos.y);
    switch (action) {
      case "UPLEFT":
        target.x -= 1;
        target.y -= 1;
        break;
      case "UP":
        target.y -= 1;
        break;
      case "UPRIGHT":
        target.x += 1;
        target.y -= 1;
        break;
      case "RIGHT":
        target.x += 1;
        break;
      case "DOWNRIGHT":
        target.x += 1;
        target.y += 1;
        break;
      case "DOWN":
        target.y += 1;
        break;
      case "DOWNLEFT":
        target.x -= 1;
        target.y += 1;
        break;
      case "LEFT":
        target.x -= 1;
        break;
      default:
        break;
    }

    if (this.canMove(target)) {
      this.pos = target;
      return true;
    }
    return false;
  }
  canMove(p) {
    const tile = r.map[p.x][p.y];
    if (tile.walkable) {
      return true;
    }
    return false;
  }
}

export {
  createEntity,
};
