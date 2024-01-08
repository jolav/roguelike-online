/* */

console.log('Loading...../server/player.js');

import { r } from "./run.js";
import { K, lib } from "./_conf.js";
import { entities } from "./entities.js";

const moveActions = ["UP", "DOWN", "RIGHT", "LEFT"];

function create(id) {
  return new Player(id);
}

class Player {
  constructor(id) {
    this.id = id;
    this.type = "player";
    const x = Math.floor(K.MAP_COLS / 2);
    const y = Math.floor(K.MAP_ROWS / 2);
    this.pos = new lib.Point(x, y);
    this.last = this.pos;
    this.actionDone = false;
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
    if (action === "SKIP") {
      this.actionDone = true;
      return;
    }
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
    const tile = r.map[target.x][target.y];
    if (!tile.walkable) {
      return;
    }
    const es = entities.atPoint(target, r.npcs);
    if (es.length === 0) {
      this.move(target);
    } else {
      let empty = true;
      for (let e of es) {
        if (e.is.combatant) {
          empty = false;
          this.melee(e);
        }
      }
      if (empty) {
        this.move(target);
      }
    }
  }
  move(target) {
    this.last = this.pos;
    this.pos = target;
    this.actionDone = true;
  }
  melee(target) {
    //console.log(JSON.stringify(target, null, 2));
    this.actionDone = true;
    const att = this.combat.melee + lib.randomInt(1, 5);
    const def = target.combat.defence;
    const damage = att - def;
    if (damage > 0) {
      const h = "+ " + this.type + " deals " + damage + " damage to " + target.type + "\n";
      r.history.push(h);
      target.combat.hp -= damage;
    }
    if (target.combat.hp <= 0) {
      const h = "+ " + target.type + " dies" + "\n";
      r.history.push(h);
      delete target.combat;
      target.is.blocking = false;
      target.is.mobile = false;
      target.is.combatant = false;
      target.type = "corpse of " + target.type;
      //deselect dead    
    }
  }
}

export {
  create,
};

