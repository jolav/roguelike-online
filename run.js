/* */

console.log('Loading.....game.js');

import * as render from "./render.js";
import * as map from "./map.js";
import { lib } from "./_config.js";
import { e, es } from "./entity.js";
import { K } from "./_config.js";
import * as  fov from "./fov.js";

const r = {
  nick: lib.randomNick(5, 2),
  token: lib.randomString(50),
  gameOver: false,
  counter: 0,
  turn: 0,
  date: lib.currentDate(0),
  entities: [],
  map: map.create(),
  history: ["5", "4", "3", "2", "1", "Adventure begins..."],

  start: function () {
    populateMap();
    fov.playerLOS();
    render.redraw();
  },
  newTurn: function (action) {
    r.turn++;
    r.date = lib.currentDate(r.turn);
    es.move(action);
    fov.playerLOS();
    render.redraw();
    if (r.gameOver) {
      gameOver();
    }
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
      if (foe.isCombatant) {
        takeCombatStats(foe);
      }
      r.entities[r.counter] = foe;
      r.counter++;
    }
    if (r.counter >= K.MAX_FOES) {
      return;
    }
  }
}

function takeCombatStats(foe) {
  let data = [[15, 15, 3, 3], [7, 7, 2, 1], [50, 50, 3, 2]];
  let stats = [];
  switch (foe.type) {
    case "rat":
      stats = data[1];
      break;
    case "mole rat":
      stats = data[0];
      break;
    case "player":
      stats = data[2];
  }
  foe.stats = {
    hp: stats[0],
    maxHp: stats[1],
    dmg: stats[2],
    def: stats[3],
  };

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
  takeCombatStats(player);
  return player;
}

function gameOver() {
  console.log('THIS IS THE END');
  alert('YOU LOSE');
  location.reload();
}

export {
  r,
};

