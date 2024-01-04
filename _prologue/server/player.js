/* */

console.log('Loading...../server/player.js');

import { r } from "./run.js";
import { K, lib } from "./_conf.js";
import { npcs } from "./npc.js";

const moveActions = ["UP", "DOWN", "RIGHT", "LEFT"];

class Player {
  constructor(id) {
    this.id = id;
    this.type = "player";
    const x = Math.floor(K.MAP_COLS / 2);
    const y = Math.floor(K.MAP_ROWS / 2);
    this.pos = new lib.Point(x, y);
    this.last = this.pos;
    this.turnDone = false;
    const stats = [180, 200, 4, 0, 0];
    this.combat = {
      hp: stats[0],
      maxHp: stats[1],
      melee: stats[2],
      range: stats[3],
      defence: stats[4],
    };
  }
  takeAction() {
    const action = K.ACTION;
    if (moveActions.includes(action)) {
      this.wantMove(action);
    }
  }
  wantMove(action) {
    const target = new lib.Point(this.pos.x, this.pos.y);
    switch (action) {
      case "UP":
        target.y--;
        break;
      case "DOWN":
        target.y++;
        break;
      case "RIGHT":
        target.x++;
        break;
      case "LEFT":
        target.x--;
        break;
    }
    if (this.canMove(target)) {
      this.last = this.pos;
      this.pos = target;
      this.actionDone = true;
    }
  }
  canMove(target) {
    const tile = r.map[target.x][target.y];
    if (npcs.atPoint(target).length > 0) {
      return false;
    }
    if (tile.walkable) {
      return true;
    }
    return false;
  }
}

export {
  Player,
};

