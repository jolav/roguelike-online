/* */

console.log('Loading...../core/classNpc.js');

import { K } from "./_konfig.js";
import { Entity } from "./classEntity.js";
import { r } from "./run.js";
import { utils as u } from "./utils.js";

class Npc extends Entity {
  constructor(id, type, pos, blocks, mobile, combat) {
    super(id, type, pos, blocks, mobile, combat);
  }
  assaultMove() {
    const pj = r.entities[0];
    if (u.euclideanDistance(pj.pos, this.pos) === 1) {
      this.melee(pj);
      return;
    }
    const ops = new Map();
    const p = this.pos;
    const init = u.euclideanDistance(pj.pos, p);
    let options = [];
    let options2 = [];
    const left = u.euclideanDistance(pj.pos, { x: p.x - 1, y: p.y });
    if (left <= init) {
      options.push("LEFT");
    } else {
      options2.push("LEFT");
      ops.set("LEFT", left);
    }
    const right = u.euclideanDistance(pj.pos, { x: p.x + 1, y: p.y });
    if (right <= init) {
      options.push("RIGHT");
    } else {
      options2.push("RIGHT");
      ops.set("RIGHT", right);
    }
    const up = u.euclideanDistance(pj.pos, { x: p.x, y: p.y - 1 });
    if (up <= init) {
      options.push("UP");
    } else {
      options2.push("UP");
      ops.set("UP", up);
    }
    const down = u.euclideanDistance(pj.pos, { x: p.x, y: p.y + 1 });
    if (down <= init) {
      options.push("DOWN");
    } else {
      options2.push("DOWN");
      ops.set("DOWN", down);
    }

    const downLeft = u.euclideanDistance(pj.pos, { x: p.x - 1, y: p.y + 1 });
    if (downLeft <= init) {
      options.push("DOWNLEFT");
    } else {
      options2.push("DOWNLEFT");
      ops.set("DOWNLEFT", downLeft);
    }

    const downRight = u.euclideanDistance(pj.pos, { x: p.x + 1, y: p.y + 1 });
    if (downRight <= init) {
      options.push("DOWNRIGHT");
    } else {
      options2.push("DOWNRIGHT");
      ops.set("DOWNRIGHT", downRight);
    }

    const upLeft = u.euclideanDistance(pj.pos, { x: p.x - 1, y: p.y - 1 });
    if (upLeft <= init) {
      options.push("UPLEFT");
    } else {
      options2.push("UPLEFT");
      ops.set("UPLEFT", upLeft);
    }

    const upRight = u.euclideanDistance(pj.pos, { x: p.x + 1, y: p.y - 1 });
    if (upRight <= init) {
      options.push("UPRIGHT");
    } else {
      options2.push("UPRIGHT");
      ops.set("UPRIGHT", upRight);
    }

    u.shuffleArray(options);
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
    //console.log(this.id, 'did not move');
  }
  isInPlayerLOS() {
    if (!r.map[this.pos.x][this.pos.y].visible) {
      return false;
    }
    const distanceToPlayer = u.euclideanDistance(this.pos, r.entities[0].pos);
    return distanceToPlayer <= K.FOV_PJ_RANGE - 2;//this.combat.los;
  }
}

const npcs = {
  turn: function () {
    for (let e of r.entities) {
      e.actionDone = false;
      if (e.is.mobile && e.constructor.name !== "Player") {
        if (e.isInPlayerLOS()) {
          e.assaultMove();
        } else {
          const action = u.randomAction();
          e.wantMove(action);
        }
      }
    }
  }
};

export {
  Npc,
  npcs,
};
