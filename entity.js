/* */

console.log('Loading.....entity.js');

import { r } from "./run.js";

class Entity {
  constructor(id, type, pos, blocks, mobile, combat) {
    this.id = id;
    this.type = type;
    this.pos = pos;
    this.blocks = blocks;
    this.mobile = mobile;
    this.combat = combat;
  }
  isBlocking() {
    return this.blocks;
  }
  isMobile() {
    return this.mobile;
  }
  isCombatant() {
    if (this.combat !== undefined) {
      return true;
    }
    return false;
  }
  move(dx, dy) {
    this.pos.x += dx;
    this.pos.y += dy;
  }
  canMove(dx, dy) {
    const x = this.pos.x + dx;
    const y = this.pos.y + dy;
    const destination = r.map[x][y];
    if (destination.blocks) {
      return false;
    }
    if (entities.isPointFreeOfBlockingEntities(x, y)) {
      return true;
    }
    return false;
  }
  getMove(action) {
    let dx = 0;
    let dy = 0;
    switch (action) {
      case "up":
        dy--;
        break;
      case "down":
        dy++;
        break;
      case "left":
        dx--;
        break;
      case "right":
        dx++;
        break;
      default:
    }
    return [dx, dy];
  }
}

const entities = {
  isPointFreeOfBlockingEntities: function (x, y) {
    for (let e of r.entities) {
      if (e.pos.x === x && e.pos.y === y) {
        if (e.isBlocking()) {
          return false;
        }
      }
    }
    return true;
  },
  atPoint: function (x, y) {
    let resp = [];
    for (let e of r.entities) {
      if (e.pos.x === x && e.pos.y === y) {
        resp.push(e);
      }
    }
    return resp;
  }
};

export {
  Entity as e,
  entities as es
};
