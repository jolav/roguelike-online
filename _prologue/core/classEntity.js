/* */

console.log('Loading...../core/classEntity.js');

import { K } from "./_konfig.js";
import { utils as u } from "./utils.js";
import { Point } from "./utils.js";
import { r } from "./run.js";
import { entities } from "./entities.js";

class Entity {
  constructor(id, type, pos, blocks, mobile, combat) {
    this.id = id;
    this.name = type + "_" + id;
    this.type = type;
    this.actionDone = false;
    this.pos = pos;
    this.last = this.pos;
    this.view = pos;
    this.is = {
      blocking: blocks,
      mobile: mobile,
      combatant: combat,
    };
  }
  takeAction(action) {
    let done = false;
    switch (action) {
      case "SKIP":
        done = true;
        break;
      case "UPLEFT":
      case "UP":
      case "UPRIGHT":
      case "RIGHT":
      case "DOWNRIGHT":
      case "DOWN":
      case "DOWNLEFT":
      case "LEFT":
        done = this.wantMove(action);
        break;
      /*case "HEAL":
        done = this.heal();
        break;
      case "EAT":
        done = this.eat();
        break;
      case "LOOT":
        done = this.loot();
        break;
      case "FIRE":
        done = this.fire();
        break;*/
    }
    if (done) {
      this.actionDone = true;
    }
  }
  wantMove(action) {
    const target = new Point(this.pos.x, this.pos.y);
    const diff = u.movementActionToIncreases(action);
    target.x += diff.x;
    target.y += diff.y;

    const tile = r.map[target.x][target.y];
    if (!tile.walkable) {
      return false;
    }
    const es = entities.atPoint(target, r.entities);
    if (es.length === 0) { // empty
      this.move(target);
      return true;
    }
    let empty = true;
    for (let e of es) {
      if (e.is.combatant && e.type !== this.type) {
        empty = false;
        this.melee(e);
        return true;
      } else {
        empty = false;
        return false; // avoid stacking 
      }
    }
    if (empty) { // move over corpses
      this.move(target);
      return true;
    }

    return false;
  }
  move(target) {
    this.last = this.pos;
    this.pos = target;
    this.actionDone = true;
  }
  melee(e) {
    //console.log('Melee', this.name, " attacks on ", e.name);
  }
}

export {
  Entity,
};
