/* */

console.log('Loading...../core/entities.js');

import { K } from "./_konfig.js";
import { r } from "./run.js";
import { Point } from "./utils.js";
import { utils as u } from "./utils.js";
import { Entity } from "./classEntity.js";
import { Player } from "./classPlayer.js";
import { Npc } from "./classNpc.js";

function populateMap(counter) {
  return populate.map(counter);
}

function createEntity(who, id, type, pos, blocks, mobile, combat) {
  if (who === 0) {
    return new Npc(id, type, pos, blocks, mobile, combat);
  }
  return new Player(id, type, pos, blocks, mobile, combat);
}

const populate = {
  map: function (id) {
    let result = [];
    let npcs = 0;
    for (let tries = 0; tries < K.TRIES; tries++) {
      let who = 0;
      let pos = entities.randomEmptyPoint(result);
      if (npcs === 0) who = 1; // create player
      if (pos !== undefined) {
        const e = createEntity(
          who,
          id,
          populate.npcType(npcs),
          pos,
          true,
          true,
          true,
        );
        result.push(e);
        id++;
        npcs++;
      }
      if (npcs > K.MAX_NPCS) {
        return result;
      }
    }
    return result;
  },
  npcType: function name(id) {
    if (id === 0) return "player";
    let type;
    switch (u.randomInt(1, 10)) {
      case 1:
      case 2:
        type = "mole rat";
        break;
      default:
        type = "rat";
    }
    return type;
  }
};

const entities = {
  atPoint: function (p, es) {
    let resp = [];
    for (let e of es) {
      if (e.pos.x === p.x && e.pos.y === p.y) {
        resp.push(e);
      }
    }
    return resp;
  },
  isEmptyPoint: function (p, es) {
    for (let e of es) {
      if (e.pos.x === p.x && e.pos.y === p.y) {
        //if (e.is.blocking) {
        return false;
        //}
      }
    }
    return true;
  },
  randomEmptyPoint: function (es) {
    let p = new Point(0, 0);
    let found = false;
    let tries = 0;
    while (!found && tries < K.TRIES) {
      let x = u.randomInt(1, r.map.length - 1);// K.MAP_COLS - 1);
      let y = u.randomInt(1, r.map[0].length - 1);//K.MAP_ROWS - 1);
      //try {
      if (r.map[x][y].walkable) {
        if (this.isEmptyPoint({ x, y }, es)) {
          p = { x, y };
          found = true;
        }
      }
      /*} catch (err) {
        console.log('FAIL =>', x, y);
        console.log(err);
        break;
      }*/
      tries++;
    }
    if (p.x === 0) {
      return undefined;
    }
    return p;
  },
};

export {
  entities,
  populateMap,
};
