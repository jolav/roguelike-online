/* */

console.log('Loading.....entity.js');

import { r } from "./run.js";
import { lib } from "./_config.js";

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
    if (this.combat !== undefined) {
      return true;
    }
    return false;
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
        r.gameOver = true;
      } else {
        delete target.combat;
        target.blocks = false;
        target.mobile = false;
        target.combat = false;
        target.type = "corpse of " + target.type;
      }
    }
  }
  erase() {
    let itemsToErase = entities.atPoint(this.pos.x, this.pos.y);
    itemsToErase.shift(); // remove player
    let indexToErase = [];
    for (let index = 0; index < itemsToErase.length; index++) {
      indexToErase.push(itemsToErase[index].id);
    }
    let newItems = [];
    (r.entities).map(function (item, index) {
      if (!indexToErase.includes(item.id)) {
        newItems.push(item);
      }
    });
    r.entities = newItems;
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
    console.log('selectFoe');
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
      if (e.id === 0) {
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
        const foe = this.atPoint(targetX, targetY)[0];
        if (foe !== undefined) { // avoid hitting walls
          e.melee(foe);
        }
      }
    }
  },
};

export {
  Entity as e,
  entities as es
};
