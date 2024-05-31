/* */

console.log('Loading..... /core/point.js');

import { K } from "./_konfig.js";
import { aux } from "./aux.js";

const point = {
  new: function (x, y) {
    return {
      x: x,
      y: y,
    };
  },
  isEmpty: function (p, es) {
    for (let e of es) {
      const pos = e.components.position.current;
      if (pos.x === p.x && pos.y === p.y) {
        return false;
      }
    }
    return true;
  },
  canEnter: function (p, es) {
    for (let e of es) {
      if (!e.components.blocksMov) {
        continue;
      }
      const pos = e.components.position.current;
      if (pos.x === p.x && pos.y === p.y) {
        return false;
      }
    }
    return true;
  },
  getEntities: function (p, es) {
    let resp = [];
    for (let e of es) {
      if (!e.components.position) {
        console.log('Hola');
        //continue
      }
      const pos = e.components.position.current;
      if (pos.x === p.x && pos.y === p.y) {
        resp.push(e);
      }
    }
    return resp;
  },
  randomEmptyWalkable: function (es, map) {
    let p = this.new(0, 0);
    let tries = 0;
    while (tries < K.TRIES) {
      let x = aux.randomInt(1, map.length - 2);
      let y = aux.randomInt(1, map[0].length - 2);
      if (map[x][y].walkable) {
        if (this.isEmpty({ x, y }, es)) {
          p = { x, y };
          return p;
        }
      }
      tries++;
    }

    return undefined;

  },
};

export {
  point
};
