/* */

console.log('Loading...../server/player.js');

import { r } from "./run.js";

const moveActions = ["UP", "DOWN", "RIGHT", "LEFT"];

class Player {
  constructor(id) {
    this.id = id;
    this.type = "player";
    this.pos = { x: 10, y: 10 };
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
  takeAction(action) {
    if (moveActions.includes(action)) {
      this.wantMove(action);
    }
  }
  wantMove(action) {
    const target = { x: this.pos.x, y: this.pos.y };
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
    if (tile.walkable) {
      return true;
    }
    return false;
  }
}

export {
  Player,
};

