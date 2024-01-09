/* */

console.log('Loading...../server/npcs.js');

import { K, lib } from "./_conf.js";
import { entities } from "./entities.js";
import { r } from "./run.js";

class Npc {
  constructor(id, type, pos, blocks, mobile, combat) {
    this.id = id;
    this.type = type;
    this.pos = pos;
    this.actionDone = false;
    this.is = {
      blocking: blocks,
      mobile: mobile,
      combatant: combat,
    };
  }
  isInPlayerLOS() {
    if (!r.map[this.pos.x][this.pos.y].visible) {
      return false;
    }
    const distanceToPlayer = lib.euclideanDistance(this.pos, r.pj.pos);
    return distanceToPlayer <= this.combat.los;
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
    if (tile.walkable) {
      if (entities.isEmptyPoint(target, r.npcs)) {
        this.move(target);
      }
    }
  }
  move(target) {
    this.last = this.pos;
    this.pos = target;
    this.actionDone = true;
  }
  assaultMove() {
    if (lib.euclideanDistance(r.pj.pos, this.pos) === 1) {
      this.melee(r.pj);
      return;
    }
    const ops = new Map();
    const p = this.pos;
    const init = lib.euclideanDistance(r.pj.pos, p);
    let options = [];
    let options2 = [];
    const left = lib.euclideanDistance(r.pj.pos, { x: p.x - 1, y: p.y });
    if (left <= init) {
      options.push("LEFT");
    } else {
      options2.push("LEFT");
      ops.set("LEFT", left);
    }
    const right = lib.euclideanDistance(r.pj.pos, { x: p.x + 1, y: p.y });
    if (right <= init) {
      options.push("RIGHT");
    } else {
      options2.push("RIGHT");
      ops.set("RIGHT", right);
    }
    const up = lib.euclideanDistance(r.pj.pos, { x: p.x, y: p.y - 1 });
    if (up <= init) {
      options.push("UP");
    } else {
      options2.push("UP");
      ops.set("UP", up);
    }
    const down = lib.euclideanDistance(r.pj.pos, { x: p.x, y: p.y + 1 });
    if (down <= init) {
      options.push("DOWN");
    } else {
      options2.push("DOWN");
      ops.set("DOWN", down);
    }
    lib.shuffleArray(options);
    for (let o of options) {
      this.wantMove(o);
      if (this.actionDone) {
        return;
      }
    }
    // if cant move and not adjacent player, shorter path !NOT WORKING
    options2.sort(function (a, b) {
      return a - b;
    });
    for (let o of options2) {
      this.wantMove(o);
      if (this.actionDone) {
        return;
      }
    }
    console.log(this.id, 'did not move');
  }
  melee(target) {
    const att = this.combat.melee + lib.randomInt(1, 5);
    const def = target.combat.defence;
    let damage = att - def;
    if (damage > 0) {
      target.combat.hp -= damage;
    } else {
      damage = 0;
    }
    const h = "- " + this.type + " deals " + damage + " damage to " + target.type + "\n";
    r.history.push(h);
    if (target.id === 0 && target.combat.hp <= 0) {
      r.gameOver = {
        status: true
      };
    }
  }
}

const npcs = {
  turn: function () {
    for (let e of r.npcs) {
      e.actionDone = false;
      if (e.is.mobile) {
        if (e.isInPlayerLOS()) {
          e.assaultMove();
        } else {
          const action = lib.randomAction();
          e.wantMove(action);
        }
      }
    }
  },
  create: function (counter) {
    let result = [];
    if (K.MAX_NPCS === 0) { return result; }
    let foes = 0;
    for (let tries = 0; tries < K.TRIES; tries++) {
      let pos = entities.randomEmptyPoint(result);
      if (pos !== undefined) {
        const foe = new Npc(
          counter,
          aux.npcType(),
          pos,
          true,
          true,
          true,
        );
        aux.npcCombatStats(foe);
        result.push(foe);
        counter++;
        foes++;
        //console.log(JSON.stringify(foe, null, 2));
      }
      if (foes >= K.MAX_NPCS) {
        return result;
      }
    }
    console.log("Cant create all NPCs");
    return result;
  }
};

export {
  npcs,
};

const aux = {
  npcType: function () {
    const odds = lib.randomInt(1, 10);
    if (odds < 8) {
      return "rat";
    } else {
      return "mole rat";
    }
  },
  npcCombatStats: function (foe) {
    let data = [[40, 40, 15, 0, 0, 10], [10, 10, 5, 0, 0, 6]];
    let stats = [];
    switch (foe.type) {
      case "rat":
        stats = data[1];
        break;
      case "mole rat":
        stats = data[0];
        break;
    }
    foe.is = {
      ...foe.is,
      lootable: false
    };
    foe.combat = {
      hp: stats[0],
      maxHp: stats[1],
      melee: stats[2],
      range: stats[3],
      defence: stats[4],
      los: stats[5],
    };
  },
};
