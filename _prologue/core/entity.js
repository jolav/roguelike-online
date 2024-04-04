/* */

console.log('Loading...../core/entity.js');

import { K } from "./_konfig.js";
import { utils as u } from "./utils.js";
import { Point } from "./utils.js";
import { r } from "./run.js";
import { entities } from "./entities.js";

function createEntity(id, type, pos) {
  return new Entity(id, type, pos);
}

class Entity {
  constructor(id, type, pos) {
    this.id = id;
    this.name = type + "_" + id;
    this.type = type;
    this.start(pos);
  }
  start(pos) {
    this.pos = pos;// new Point(pos.x, pos.y);
    this.view = pos; //new Point(x, y);
  }
  move(action) {
    const target = new Point(this.pos.x, this.pos.y);
    switch (action) {
      case "SKIP":
        return true;
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
    if (!tile.walkable) {
      return false;
    }
    if (!entities.isEmptyPoint(p, r.entities)) {
      return false;
    }
    return true;
  }
}

export {
  createEntity,
};
