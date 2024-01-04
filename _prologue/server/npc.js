/* */

console.log('Loading...../server/npc.js');

import { r } from "./run.js";
import { K, lib } from "./_conf.js";

class Npc {
  constructor(id, type, pos, blocks, mobile, combat, dead) {
    this.id = id;
    this.type = type;
    this.pos = pos;
    this.is = {
      blocking: blocks,
      mobile: mobile,
      combatant: combat,
      dead: dead,
    };
    //console.log(this);
  }
}

const npcs = {
  atPoint: function (p) {
    let resp = [];
    for (let e of r.npcs) {
      if (e.pos.x === p.x && e.pos.y === p.y) {
        resp.push(e);
      }
    }
    return resp;
  }
};

export {
  Npc,
  npcs,
};
