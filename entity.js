/* */

console.log('Loading.....entity.js');

import { r } from "./run.js";
import { lib } from "./_config.js";

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
  isVisible() {
    return r.map[this.pos.x][this.pos.y].visible;
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
      case "skip":
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
  },
  move: function (action) {
    const player = r.entities[0];
    for (let e of r.entities) {
      let d = [];
      if (e.id === 0) {
        d = player.getMove(action);
      }
      if (e.id !== 0 && e.isMobile) {
        if (e.isVisible()) {
          d = this.assaultMove(e);
        } else {
          d = e.getMove(lib.randomAction());
        }
      }
      const dx = d[0];
      const dy = d[1];
      if (e.canMove(dx, dy)) {
        e.move(dx, dy);
      }
    }
  },
  assaultMove: function (e) {
    const pj = r.entities[0];
    let options = [];
    const init = lib.pointsDistance(pj.pos, e.pos);
    const left = lib.pointsDistance(pj.pos, { x: e.pos.x - 1, y: e.pos.y });
    if (left <= init) {
      options.push("left");
    }
    const right = lib.pointsDistance(pj.pos, { x: e.pos.x + 1, y: e.pos.y });
    if (right <= init) {
      options.push("right");
    }
    const up = lib.pointsDistance(pj.pos, { x: e.pos.x, y: e.pos.y - 1 });
    if (up <= init) {
      options.push("up");
    }
    const down = lib.pointsDistance(pj.pos, { x: e.pos.x, y: e.pos.y + 1 });
    if (down <= init) {
      options.push("down");
    }

    lib.shuffleArray(options);
    for (let o of options) {
      const d = e.getMove(o);
      if (e.canMove(d[0], d[1])) {
        return [d[0], d[1]];
      }
    }
    // if cant move and not adjacent player, rnd move
    if (lib.pointsDistance(pj.pos, e.pos) > 1) {
      options = ["up", "down", "left", "right"];
      lib.shuffleArray(options);
      for (let o of options) {
        const d = e.getMove(o);
        if (e.canMove(d[0], d[1])) {
          return [d[0], d[1]];
        }
      }
    }
    return [0, 0];
  }
};

export {
  Entity as e,
  entities as es
};
