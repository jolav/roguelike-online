/* */

console.log('Loading...../server/entities.js');

import { lib, K } from "./_conf.js";
import { r } from "./run.js";

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
        if (e.is.blocking) {
          return false;
        }
      }
    }
    return true;
  },
  randomEmptyPoint: function (es) {
    let p = new lib.Point(0, 0);
    let found = false;
    let tries = 0;
    while (!found && tries < K.TRIES) {
      let x = lib.randomInt(1, K.MAP_COLS - 1);
      let y = lib.randomInt(1, K.MAP_ROWS - 1);
      if (r.map[x][y].walkable) {
        if (this.isEmptyPoint({ x, y }, es)) {
          if (r.pj.pos.x !== x || r.pj.pos.y !== y) {
            p = { x, y };
            found = true;
          }
        }
      }
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
};
