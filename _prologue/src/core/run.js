/* */

console.log('Loading..... /core/run.js');

import { populateMap } from "./entities.js";

const r = {
  turn: 0,
  counter: 0,
  entities: [],
  start: function (params) {
    [r.entities, r.counter] = populateMap(r.counter, params);
  },
  manageTurn: function (params) {
    switch (params.action) {
      case "UPLEFT":
        r.entities[0].components.position.x--;
        r.entities[0].components.position.y--;
        break;
      case "UP":
        r.entities[0].components.position.y--;
        break;
      case "UPRIGHT":
        r.entities[0].components.position.x++;
        r.entities[0].components.position.y--;
        break;
      case "RIGHT":
        r.entities[0].components.position.x++;
        break;
      case "DOWNRIGHT":
        r.entities[0].components.position.x++;
        r.entities[0].components.position.y++;
        break;
      case "DOWN":
        r.entities[0].components.position.y++;
        break;
      case "DOWNLEFT":
        r.entities[0].components.position.x--;
        r.entities[0].components.position.y++;
        break;
      case "LEFT":
        r.entities[0].components.position.x--;
    }
  },
};

export {
  r
};

