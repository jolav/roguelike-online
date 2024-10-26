/* */

console.log('Loading..... core/point.js');

import { myRandom } from "../aux/random.js";
import { K } from "./_konfig.js";
import { components } from "./ecs_components.js";

const point = {
  new: function (x, y) {
    return {
      x: x,
      y: y,
    };
  },
  isEmpty: function (p, es) {
    for (const [_, e] of es) {
      if (e.hasComponent(components.Position)) {
        const pos = e.components.Position.current;
        if (pos.x === p.x && pos.y === p.y) {
          return false;
        }
      }
    }
    return true;
  },
  isWalkable: function (p, map) {
    if (map[p.x][p.y].walkable) {
      return true;
    }
    return false;
  },
  /*getEntities: function (p, es) {
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
  },*/
  randomEmptyWalkable: function (es, map) {
    let p = this.new(0, 0);
    let tries = 0;
    while (tries < K.TRIES) {
      p.x = myRandom.int(1, map.length - 2);
      p.y = myRandom.int(1, map[0].length - 2);
      if (this.isWalkable(p, map)) {
        if (this.isEmpty(p, es)) {
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
