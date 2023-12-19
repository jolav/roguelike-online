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
    this.is = {
      blocking: blocks,
      mobile: mobile,
      combatant: combat,
      item: item,
    };
    //console.log(this);
  }
  isInPlayerLOS() {
    return r.map[this.pos.x][this.pos.y].visible;
  }
  move(dx, dy) {
    this.pos.x += dx;
    this.pos.y += dy;
  }
  canMove(dx, dy) {
    // better skip turn in deads and remove this
    if (!this.is.mobile) {
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
  getDirection(action) {
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
      const d = this.getDirection(o);
      if (this.canMove(d[0], d[1])) {
        return [d[0], d[1]];
      }
    }
    // if cant move and not adjacent player, rnd move
    if (lib.pointsDistance(pj.pos, this.pos) > 1) {
      options = ["up", "down", "left", "right"];
      lib.shuffleArray(options);
      for (let o of options) {
        const d = this.getDirection(o);
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
      this.killing(target);
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
      this.killing(target);
    }
  }
  killing(target) {
    //target.is.lootable = true; when corpses give loot, not yet done
    if (target === r.entities[0]) {
      r.gameOver = { status: true };
    } else {
      delete target.combat;
      target.is.blocking = false;
      target.is.mobile = false;
      target.is.combatant = false;
      target.type = "corpse of " + target.type;
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
        this.delete(e.id);
      }
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
  eat() {
    if (this.combat.hp < this.combat.maxHp && this.inventory.food > 0) {
      this.combat.hp++;
      this.inventory.food--;
    }
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
      if (e.isInPlayerLOS() && e.is.combatant) {
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
        if (e.is.blocking) {
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
    // char turn
    const player = r.entities[0];
    let d = [];
    switch (action) {
      case "loot":
      case "eat":
      case "heal":
      case "fire":
        player[action]();
        break;
      case "skip":
        break;
      default:
        d = player.getDirection(action);
        if (player.canMove(d[0], d[1])) {
          player.move(d[0], d[1]);
        } else {
          const targetX = player.pos.x + d[0];
          const targetY = player.pos.y + d[1];
          if (r.map[targetX][targetY].walkable) {
            const foes = this.atPoint(targetX, targetY);
            for (let f of foes) {
              if (f.is.combatant) {
                player.melee(f);
              }
            }
          }
        }
    }
    // entities turn
    for (let e of r.entities) {
      if (e.id === 0) {
        continue;
      }
      let d = [];
      if (e.is.mobile) {
        if (e.isInPlayerLOS()) {
          d = e.assaultMove();
        } else {
          d = e.getDirection(lib.randomAction());
        }
      }
      if (e.canMove(d[0], d[1])) {
        e.move(d[0], d[1]);
      }
    }
  },
};

export {
  Entity as e,
  entities as es
};
