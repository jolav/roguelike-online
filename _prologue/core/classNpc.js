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
    if (u.euclideanDistance(pj.pos, this.pos) < 1.5) {
      this.melee(pj);
      return;
    }
    const options = [];
    const p = this.pos;

    const left = u.euclideanDistance(pj.pos, { x: p.x - 1, y: p.y });
    options.push(["LEFT", left]);
    const right = u.euclideanDistance(pj.pos, { x: p.x + 1, y: p.y });
    options.push(["RIGHT", right]);
    const up = u.euclideanDistance(pj.pos, { x: p.x, y: p.y - 1 });
    options.push(["UP", up]);
    const down = u.euclideanDistance(pj.pos, { x: p.x, y: p.y + 1 });
    options.push(["DOWN", down]);
    const downLeft = u.euclideanDistance(pj.pos, { x: p.x - 1, y: p.y + 1 });
    options.push(["DOWNLEFT", downLeft]);
    const downRight = u.euclideanDistance(pj.pos, { x: p.x + 1, y: p.y + 1 });
    options.push(["DOWNRIGHT", downRight]);
    const upLeft = u.euclideanDistance(pj.pos, { x: p.x - 1, y: p.y - 1 });
    options.push(["UPLEFT", upLeft]);
    const upRight = u.euclideanDistance(pj.pos, { x: p.x + 1, y: p.y - 1 });
    options.push(["UPRIGHT", upRight]);

    options.sort(function (a, b) {
      return a[1] - b[1];
    });

    for (let o of options) {
      this.takeAction(o[0]);
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
  turn() {
    this.actionDone = false;
    if (this.is.mobile) {// && e.constructor.name !== "Player") {
      if (this.isInPlayerLOS()) {
        this.assaultMove();
      } else {
        const action = u.randomAction();
        this.takeAction(action);
      }
    }
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
          //e.wantMove(action);
          e.takeAction(action);
        }
      }
    }
  }
};

export {
  Npc,
  npcs,
};
