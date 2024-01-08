/* */

console.log('Loading...../server/npc.js');

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
      dead: false,
    };
  }
  isInPlayerLOS(pj, map) {
    if (!map[this.pos.x][this.pos.y].visible) {
      return false;
    }
    const distanceToPlayer = lib.euclideanDistance(this.pos, pj);
    return distanceToPlayer <= this.combat.los;
  }
  wantMove(action, pj, map) {
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
    if (this.canMove(target, map)) {
      this.last = this.pos;
      this.pos = target;
      this.actionDone = true;
    }
  }
  canMove(target, map) {
    const npcs = r.npcs;
    const tile = map[target.x][target.y];
    if (tile.walkable && entities.isEmptyPoint(target, npcs)) {
      return true;
    }
    return false;
  }
  assaultMove(pj, map) {
    if (lib.euclideanDistance(pj, this.pos) === 1) {
      this.melee(pj);
      return;
    }
    const ops = new Map();
    const p = this.pos;
    const init = lib.euclideanDistance(pj, p);
    let options = [];
    let options2 = [];
    const left = lib.euclideanDistance(pj, { x: p.x - 1, y: p.y });
    if (left <= init) {
      options.push("LEFT");
    } else {
      options2.push("LEFT");
      ops.set("LEFT", left);
    }
    const right = lib.euclideanDistance(pj, { x: p.x + 1, y: p.y });
    if (right <= init) {
      options.push("RIGHT");
    } else {
      options2.push("RIGHT");
      ops.set("RIGHT", right);
    }
    const up = lib.euclideanDistance(pj, { x: p.x, y: p.y - 1 });
    if (up <= init) {
      options.push("UP");
    } else {
      options2.push("UP");
      ops.set("UP", up);
    }
    const down = lib.euclideanDistance(pj, { x: p.x, y: p.y + 1 });
    if (down <= init) {
      options.push("DOWN");
    } else {
      options2.push("DOWN");
      ops.set("DOWN", down);
    }
    lib.shuffleArray(options);
    for (let o of options) {
      this.wantMove(o, pj, map);
      if (this.actionDone) {
        return;
      }
    }
    // if cant move and not adjacent player, rnd move
    //lib.shuffleArray(options2);
    options2.sort(function (a, b) {
      return a - b;
    });
    for (let o of options2) {
      this.wantMove(o, pj, map);
      if (this.actionDone) {
        return;
      }
    }

    console.log(this.id, 'did not move');
  }
  melee() {
    console.log('Melee');
  }
}

const npcs = {
  turn: function (pj, map) {
    for (let e of r.npcs) {
      e.actionDone = false;
      if (e.is.mobile) {
        if (e.isInPlayerLOS(pj, map)) {
          e.assaultMove(pj, map);
        } else {
          const action = lib.randomAction();
          e.wantMove(action, pj, map);
        }
      }
    }
  },
  create: function () {
    return populate.npcs();
  }
};

function createNPCs(counter) {
  return populate.npcs(counter);
}

const populate = {
  npcs: function (counter) {
    let foes = 0;
    let result = [];
    for (let tries = 0; tries < K.TRIES; tries++) {
      let pos = entities.randomEmptyPoint(result);
      if (pos !== undefined) {
        const foe = new Npc(
          counter,
          this.npcsType(),
          pos,
          true,
          true,
          true,
        );
        this.npcsCombatStats(foe);
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
  },
  npcsType: function () {
    const odds = lib.randomInt(1, 10);
    if (odds < 8) {
      return "rat";
    } else {
      return "mole rat";
    }
  },
  npcsCombatStats: function (foe) {
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

export {
  npcs,
  createNPCs
};
