/* */

console.log('Loading...../core/classActor.js');

import { K } from "./_konfig.js";
import { Entity } from "./classEntity.js";
import { utils as u } from "./utils.js";
import { Point } from "./utils.js";
import { r } from "./run.js";
import { entities } from "./entities.js";
import { data } from "./dataFile.js";
import { history } from "./history.js";

class Actor extends Entity {
  constructor(id, type, pos, blocks, mobile, combat, item) {
    super(id, type, pos, blocks, mobile, combat, item);
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
    this.inventory = {
      food: 0,
      supply: 0,
      medical: 0,
    };
    this.equipment = {
      head: undefined,
      body: undefined,
      melee: undefined,
      range: undefined,
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
      case "HEAL":
        done = this.heal();
        break;
      case "EAT":
        done = this.eat();
        break;
      case "LOOT":
        done = this.loot();
        break;
      case "FIRE":
        done = this.fire(target);
        break;
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
    history.melee(this, damage, e);
    if (e.combat.hp <= 0) {
      this.kill(e);
    }
  }
  kill(e) {
    history.kill(e);
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
  eat() {
    if (this.combat.hp < this.combat.maxHp && this.inventory.food > 0) {
      this.combat.hp++;
      this.inventory.food--;
      history.eat(this, 1);
      return true;
    }
  }
  heal() {
    if (this.combat.hp < this.combat.maxHp && this.inventory.medical > 0) {
      let qty = 10;
      if (this.combat.maxHp - this.combat.hp < qty) {
        qty = this.combat.maxHp - this.combat.hp;
      }
      this.combat.hp += qty;
      this.inventory.medical--;
      history.heal(this, qty);
      return true;
    }
  }
  loot() {
    let done = false;
    let itemsToLoot = entities.atPoint(this.pos, r.items);
    for (let e of itemsToLoot) {
      if (e.type === "exit") {
        r.gameOver = { status: true, win: true };
      }
      if (e.is.lootable) {
        if (e.data.qty > 0) {
          this.inventory[e.type] += e.data.qty;
        }
        if (e.is.equippable && !e.is.equipped) {
          switch (e.type) {
            case "firearm":
              this.equipment.range = e;
              this.combat.range = this.equipment.range.data.range;
              break;
            case "melee":
              this.equipment.melee = e;
              this.combat.melee = this.equipment.melee.data.melee;
              break;
            case "body":
              this.equipment.body = e;
              this.combat.defence = this.equipment.body.data.defence;
          }
          e.is.equipped = true;
          e.is.lootable = false;
          e.pos = this.pos; // player carries item
        }
        history.loot(e);
        this.deleteItem(e.id);
        done = true;
      }
    }
    return done;
  }
  deleteItem(id) {
    const index = r.items.findIndex(function (e) {
      return e.id === id;
    });
    r.items.splice(index, 1);
  }
  fire(id) {
    let done = false;
    const indexTarget = r.entities.findIndex(function (e) {
      return e.id === id;
    });
    const target = r.entities[indexTarget];
    if (this.inventory.supply < 1) {
      return done;
    }
    if (target === undefined || target.combat === undefined) {
      return false; // avoid fire without valid target
    }
    this.inventory.supply--;
    this.actionDone = true;
    const att = this.combat.range + u.randomInt(1, 5);
    const def = target.combat.defence;
    let damage = att - def;
    if (damage > 0) {
      target.combat.hp -= damage;
    } else {
      damage = 0;
    }
    history.fire(this, damage, target);
    if (target.combat.hp <= 0) {
      this.kill(target);
    }
    done = true;
    return done;
  }
}

export {
  Actor,
};
