/* */

console.log('Loading.....game.js');

import * as render from "./render.js";
import * as map from "./map.js";
import { lib } from "./_config.js";
import { e, es } from "./entity.js";
import { K } from "./_config.js";

const r = {
  nick: lib.getRandomNick(5, 2),
  token: lib.getRandomString(50),
  gameOver: false,
  counter: 0,
  turn: 0,
  date: lib.getCurrentDate(0),
  entities: [],
  map: map.create(),
  history: ["......."],

  start: function () {
    populateMap();
    render.redraw();
    //render.redraw(); test double for font bug ?????
  },
  newTurn: function (action) {
    const d = r.entities[0].getMove(action);
    if (r.entities[0].canMove(d[0], d[1])) {
      r.entities[0].move(d[0], d[1]);
    }
    render.redraw();
  },

};

function populateMap() {
  r.entities[0] = createPlayer();
  r.counter++;
  createFoes();
}

function createFoes() {
  for (let tries = 0; tries < K.FOES_TRIES; tries++) {
    let p = getRandomEmptyPoint();
    if (p !== undefined) {
      const foe = new e(r.counter, getFoeType(), p, true, true, true);
      r.entities[r.counter] = foe;
      r.counter++;
    }
  }
}

function getRandomEmptyPoint() {
  let p = { x: 0, y: 0 };
  let found = false;
  let tries = 0;
  while (!found && tries < K.FOES_TRIES) {
    let x = lib.randomInt(2, K.MAP_X - 2);
    let y = lib.randomInt(2, K.MAP_Y - 2);
    if (!r.map[x][y].blocks) {
      if (es.isPointFreeOfBlockingEntities(x, y)); {
        p = { x, y };
        found = true;
      }
    }
    tries++;
  }
  if (p.x === 0) {
    return undefined;
  }
  return p;
}

function getFoeType() {
  const odds = lib.randomInt(1, 10);
  if (odds < 8) {
    return "rat";
  } else {
    return "mole rat";
  }
}

function createPlayer() {
  const x = Math.floor(K.MAP_X / 2);
  const y = Math.floor(K.MAP_Y / 2);
  const pos = { x, y };
  const player = new e(r.counter, "player", pos, true, true, true);
  return player;
}

export {
  r,
};

