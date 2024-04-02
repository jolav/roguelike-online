/* */

import { K } from "./_konfig.js";
import { utils as u } from "./utils.js";

function createEntity(id) {
  return new Entity(id);
}

class Entity {
  constructor(id) {
    this.id = id;
    const x = Math.floor(K.CAM_COLS / 2);
    const y = Math.floor(K.CAM_ROWS / 2);
    this.pos = {
      current: new u.Point(x, y),
      target: new u.Point(x, y),
      view: new u.Point(x, y),
    };
  }
  move(action) {
    switch (action) {
      case "UPLEFT":
        this.pos.target.x -= 1;
        this.pos.target.y -= 1;
        break;
      case "UP":
        this.pos.target.y -= 1;
        break;
      case "UPRIGHT":
        this.pos.target.x += 1;
        this.pos.target.y -= 1;
        break;
      case "RIGHT":
        this.pos.target.x += 1;
        break;
      case "DOWNRIGHT":
        this.pos.target.x += 1;
        this.pos.target.y += 1;
        break;
      case "DOWN":
        this.pos.target.y += 1;
        break;
      case "DOWNLEFT":
        this.pos.target.x -= 1;
        this.pos.target.y += 1;
        break;
      case "LEFT":
        this.pos.target.x -= 1;
        break;
      default:
        break;
    }
  }
}

export {
  createEntity,
};
