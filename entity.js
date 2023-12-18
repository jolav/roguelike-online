/* */

console.log('Loading.....entity.js');

import { r } from "./run.js";
import { lib } from "./_config.js";
import { K } from "./_config.js";

class Entity {
  constructor(id, type, pos, blocks, mobile, combat, item) {
    this.id = id;
    this.type = type;
    this.pos = pos;
    this.blocks = blocks;
    this.mobile = mobile;
    this.combat = combat;
    this.item = item;
  }
  isBlocking() {
    return this.blocks;
  }
  isMobile() {
    return this.mobile;
  }
  isCombatant() {
    return this.combat;
  }
  isItem() {
    return this.item;
  }
  isVisible() { // is in player LOS
    return r.map[this.pos.x][this.pos.y].visible;
  }
  move(dx, dy) {
    this.pos.x += dx;
    this.pos.y += dy;
  }
  canMove(dx, dy) {
    if (!this.isMobile()) {
      return false; //deads not move
    }
    const x = this.pos.x + dx;
    const y = this.pos.y + dy;
    const destination = r.map[x][y];
    if (!destination.walkable) {
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
  assaultMove() {
    const pj = r.entities[0];
    if (lib.pointsDistance(pj.pos, this.pos) === 1) {
      this.melee(pj);
      return [0, 0];
    }
    let options = [];
    const init = lib.pointsDistance(pj.pos, this.pos);
    const left = lib.pointsDistance(pj.pos,
      { x: this.pos.x - 1, y: this.pos.y });
    if (left <= init) {
      options.push("left");
    }
    const right = lib.pointsDistance(pj.pos,
      { x: this.pos.x + 1, y: this.pos.y });
    if (right <= init) {
      options.push("right");
    }
    const up = lib.pointsDistance(pj.pos,
      { x: this.pos.x, y: this.pos.y - 1 });
    if (up <= init) {
      options.push("up");
    }
    const down = lib.pointsDistance(pj.pos,
      { x: this.pos.x, y: this.pos.y + 1 });
    if (down <= init) {
      options.push("down");
    }

    lib.shuffleArray(options);
    for (let o of options) {
      const d = this.getMove(o);
      if (this.canMove(d[0], d[1])) {
        return [d[0], d[1]];
      }
    }
    // if cant move and not adjacent player, rnd move
    if (lib.pointsDistance(pj.pos, this.pos) > 1) {
      options = ["up", "down", "left", "right"];
      lib.shuffleArray(options);
      for (let o of options) {
        const d = this.getMove(o);
        if (this.canMove(d[0], d[1])) {
          return [d[0], d[1]];
        }
      }
    }
    return [0, 0];
  }
  melee(target) {
    const att = this.combat.melee + lib.randomInt(1, 5);
    const def = target.combat.defence;
    const damage = att - def;
    if (damage > 0) {
      const h = this.type + " deals " + damage + " damage" + "\n";
      r.history.push(h);
      target.combat.hp -= damage;
    }
    if (target.combat.hp <= 0) {
      target.isDead = true;
      //target.is.lootable = true; when corpses give loot, not yet done
      if (target === r.entities[0]) {
        r.gameOver = { status: true };
      } else {
        delete target.combat;
        target.blocks = false;
        target.mobile = false;
        target.combat = false;
        target.type = "corpse of " + target.type;
      }
    }
  }
  fire(target) {
    if (this.inventory.supply < 1) {
      return;
    }
    this.inventory.supply--;
    const att = this.combat.range + lib.randomInt(1, 5);
    const def = target.combat.defence;
    const damage = att - def;
    if (damage > 0) {
      const h = this.type + " deals " + damage + " damage" + "\n";
      r.history.push(h);
      target.combat.hp -= damage;
    }
    if (target.combat.hp <= 0) {
      target.isDead = true;
      //target.is.lootable = true; when corpses give loot, not yet done
      if (target === r.entities[0]) {
        r.gameOver = { status: true };
      } else {
        delete target.combat;
        target.blocks = false;
        target.mobile = false;
        target.combat = false;
        target.type = "corpse of " + target.type;
      }
    }
  }
  delete(id) {
    const index = r.entities.findIndex(function (e) {
      return e.id === id;
    });
    r.entities.splice(index, 1);
  }
  loot() {
    let itemsToLoot = entities.atPoint(this.pos.x, this.pos.y);
    itemsToLoot.shift(); // remove player
    for (let e of itemsToLoot) {
      if (e.type === "exit") {
        r.gameOver = { status: true, win: true };
      }
      if (e.is.lootable) {
        if (e.data.qty > 0) {
          this.inventory[e.type] += e.data.qty;
          //this.delete(e.id);
        }
        if (e.is.equippable && !e.is.equipped) {
          switch (e.type) {
            case "firearm":
              this.equipment.range = e;
              this.combat.range = this.equipment.range.data.range;
              break;
            case "melee":
              this.equipment.melee = e;
              this.combat.melee = 6 + this.equipment.melee.data.melee;
              break;
            case "body":
              this.equipment.body = e;
              this.combat.defence = this.equipment.body.data.defence;
          }
          e.is.visible = false;
          e.is.equipped = true;
          e.is.lootable = false;
          e.pos = this.pos; // player carries item
          //this.updateSlots();
          //this.delete(e.id);
        }
        this.delete(e.id);
      }
    }
  }
  updateSlots() {
    if (this.equipment.melee !== undefined) {
      this.combat.melee = 6 + this.equipment.melee.data.melee;
    }
    if (this.equipment.range !== undefined) {
      this.combat.range = this.equipment.range.data.range;
    }
    if (this.equipment.body !== undefined) {
      this.combat.defence = this.equipment.body.data.defence;
    }
    if (this.equipment.head !== undefined) {
      this.combat.defence = this.equipment.head.data.defence;
    }
  }
  eat() {
    if (this.combat.hp < this.combat.maxHp && this.inventory.food > 0) {
      this.combat.hp++;
      this.inventory.food--;
    }
  }
  selectFoe() {
    if (r.turn !== this.targets.when) {
      this.targets = {
        when: r.turn,
        who: -1,
        foes: entities.foesInSight(),
      };
      if (this.targets.foes.length > 0) {
        this.targets.who = 0;
      }
    }
    if (this.targets.foes.length === this.targets.who + 1) {
      this.targets.who = 0;
    } else if (this.targets.foes.length > this.targets.who) {
      this.targets.who++;
    }
    //console.log(this.targets);
  }
  heal() {
    if (this.combat.hp < this.combat.maxHp && this.inventory.medical > 0) {
      this.combat.hp += 10;
      this.inventory.medical--;
    }
    if (this.combat.hp > this.combat.maxHp) {
      this.combat.hp = this.combat.maxHp;
    }
  }
}

const entities = {
  foesInSight: function () {
    const foesInSight = [];
    for (let e of r.entities) {
      if (e.id === 0) {
        continue;
      }
      if (e.isVisible() && e.isCombatant() && !e.isDead) {
        const pjX = r.entities[0].pos.x + 0.5;
        const pjY = r.entities[0].pos.y + 0.5;
        const distance = lib.entitiesDistance(pjX, pjY, e.pos.x, e.pos.y);
        if (distance <= K.LOS_RADIUS) {
          foesInSight.push(e);
        }
      }
    }
    return foesInSight;
  },
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
  turn: function (action) {
    const player = r.entities[0];
    for (let e of r.entities) {
      let d = [];
      if (e.id === 0 && action === "fire") {
        if (e.combat.range > 0) {
          e.fire(e.targets.foes[e.targets.who]);
        }
        continue;
      } else {
        d = player.getMove(action);
      }
      if (e.id !== 0 && e.isMobile()) {
        if (e.isVisible()) {
          d = e.assaultMove();
        } else {
          d = e.getMove(lib.randomAction());
        }
      }
      const dx = d[0];
      const dy = d[1];
      if (e.canMove(dx, dy)) {
        e.move(dx, dy);
      } else if (e.id === 0 && action !== "skip") { //skip avoid self-harm
        const targetX = player.pos.x + dx;
        const targetY = player.pos.y + dy;
        const foes = this.atPoint(targetX, targetY);//[0];
        for (let f of foes) {
          if (f !== undefined && f.isCombatant()) { // avoid walls and corpses
            e.melee(f);
          }
        }
      }
    }
  },
};

export {
  Entity as e,
  entities as es
};
