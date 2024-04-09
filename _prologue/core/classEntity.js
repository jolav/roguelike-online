/* */

console.log('Loading...../core/classEntity.js');

import { K } from "./_konfig.js";
import { utils as u } from "./utils.js";
import { Point } from "./utils.js";
import { r } from "./run.js";
import { entities } from "./entities.js";
import { data } from "./dataFile.js";

class Entity {
  constructor(id, type, pos, blocks, mobile, combat) {
    this.id = id;
    this.name = type + "_" + id;
    this.type = type;
    this.pos = pos;
    this.last = this.pos;
    this.view = pos;
    this.is = {
      blocking: blocks,
      mobile: mobile,
      combatant: combat,
    };
    this.more();
  }
  more() {
    if (!this.is.combatant) {
      return;
    }
    this.actionDone = false;
    this.realAction = "";
    const stats = data.combat.get(this.type);
    this.combat = {
      hp: stats[0],
      maxHp: stats[1],
      melee: stats[2],
      range: stats[3],
      defence: stats[4],
    };
    this.losRange = data.losRange.get(this.type);

  }
  takeAction(action, target) {
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
      case "MELEE":
        done = this.melee(target);
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
      this.realAction = action;
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

    for (let e of es) {
      if (e.is.combatant) {
        if (e.type !== this.type) {
          this.takeAction("MELEE", e);
          //this.melee(e)
          return true;
        } else {
          return false; //avoid stacking
        }
      }
    }
    this.move(target); // over corpses
    return true;
  }
  move(target) {
    this.last = this.pos;
    this.pos = target;
  }
  melee(e) {
    //console.log('Melee', this.name, " attacks on ", e.name);
    const att = this.combat.melee + u.randomInt(1, 5);
    const def = e.combat.defence;
    let damage = att - def;
    if (damage > 0) {
      e.combat.hp -= damage;
    } else {
      damage = 0;
    }
    const h = this.type + " deals " + damage + " damage to " + e.name;
    r.history.push(h);
    if (e.combat.hp <= 0) {
      //console.log('Killed ', e.name);
      const h = "-" + e.name + " dies";
      r.history.push(h);
      this.kill(e);
    }
  }
  kill(e) {
    if (e.id === 0) {
      r.gameOver.status = true;
      return;
    }
    delete e.combat;
    delete e.actionDone;
    delete e.realAction;
    delete e.losRange;
    e.is.blocking = false;
    e.is.mobile = false;
    e.is.combatant = false;
    e.type = "corpse of " + e.type;
  }
}

export {
  Entity,
};
