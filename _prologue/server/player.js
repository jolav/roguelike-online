/* */

console.log('Loading...../server/player.js');

import { r } from "./run.js";
import { K, lib } from "./_conf.js";
import { entities } from "./entities.js";

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
  }
  takeAction() {
    let done = false;
    switch (K.ACTION) {
      case "SKIP":
        done = true;
        break;
      case "UP":
      case "DOWN":
      case "RIGHT":
      case "LEFT":
        done = this.wantMove();
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
        done = this.fire();
        break;
    }
    if (done) {
      this.actionDone = true;
    }
  }
  wantMove() {
    const target = new lib.Point(this.pos.x, this.pos.y);
    let done = false;
    switch (K.ACTION) {
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
      return done;
    }
    const es = entities.atPoint(target, r.npcs);
    if (es.length === 0) {
      this.move(target);
      done = true;
    } else {
      let empty = true;
      for (let e of es) {
        if (e.is.combatant) {
          empty = false;
          this.melee(e);
          done = true;
        }
      }
      if (empty) { // move over corpses
        this.move(target);
        done = true;
      }
    }
    return done;
  }
  move(target) {
    this.last = this.pos;
    this.pos = target;
  }
  melee(target) {
    this.actionDone = true;
    const att = this.combat.melee + lib.randomInt(1, 5);
    const def = target.combat.defence;
    let damage = att - def;
    if (damage > 0) {
      target.combat.hp -= damage;
    } else {
      damage = 0;
    }
    const h = "+ " + this.type + " deals " + damage + " damage to " + target.type + "\n";
    r.history.push(h);
    if (target.combat.hp <= 0) {
      this.killingNpc(target);
    }
  }
  fire() {
    let done = false;
    const indexTarget = r.npcs.findIndex(function (e) {
      return e.id === K.ID_SELECTED;
    });
    const target = r.npcs[indexTarget];
    if (this.inventory.supply < 1) {
      return done;
    }
    this.inventory.supply--;
    this.actionDone = true;
    const att = this.combat.range + lib.randomInt(1, 5);
    const def = target.combat.defence;
    let damage = att - def;
    if (damage > 0) {
      target.combat.hp -= damage;
    } else {
      damage = 0;
    }
    const h = "+ " + this.type + " deals " + damage + " damage to " + target.type + "\n";
    r.history.push(h);
    if (target.combat.hp <= 0) {
      this.killingNpc(target);
    }
    done = true;
    return done;
  }
  killingNpc(target) {
    const h = "+ " + target.type + " dies" + "\n";
    r.history.push(h);
    delete target.combat;
    target.is.blocking = false;
    target.is.mobile = false;
    target.is.combatant = false;
    target.type = "corpse of " + target.type;
  }
  eat() {
    if (this.combat.hp < this.combat.maxHp && this.inventory.food > 0) {
      this.combat.hp++;
      this.inventory.food--;
      return true;
    }
  }
  heal() {
    if (this.combat.hp < this.combat.maxHp && this.inventory.medical > 0) {
      this.combat.hp += 10;
      this.inventory.medical--;
      if (this.combat.hp > this.combat.maxHp) {
        this.combat.hp = this.combat.maxHp;
      }
      return true;
    }
  }
  loot() {
    let done = false;
    let itemsToLoot = entities.atPoint(this.pos, r.items);
    for (let e of itemsToLoot) {
      if (e.type === "exit") {
        r.gameOver = { status: true, win: true };
        done = true;
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
}

export {
  create,
};

