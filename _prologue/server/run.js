/* */

console.log('Loading...../server/run.js');

import { lib, K } from "./_conf.js";
import { Player } from "./player.js";
import * as map from "./map.js";
import * as fov from "./fov.js";
import { Npc, npcs } from "./npc.js";

const r = {
  nick: lib.randomNick(5, 2),
  token: lib.randomString(50),
  gameOver: {
    status: false,
    win: false,
  },
  counter: 0,
  turn: 0,
  pj: {},
  cam: { x: 0, y: 0 },
  npcs: [],
  //items: [],
  map: [],
  //history: ["8", "7", "6", "5", "4", "3", "2", "1", "Adventure begins..."],
  start: function () {
    this.map = map.create();
    this.pj = new Player(this.counter);
    populate.npcs();
    this.cam = aux.updateCam();
    fov.get();
    this.counter++;
  },
  oneMoreTurn: function () {
    this.pj.actionDone = false;
    this.pj.takeAction();
    if (!this.pj.actionDone) {
      return;
    }
    this.cam = aux.updateCam();
    fov.get();
    this.turn++;
  },
};

const populate = {
  npcs: function () {
    let foes = 0;
    for (let tries = 0; tries < K.TRIES; tries++) {
      let pos = aux.randomEmptyPoint();
      if (pos !== undefined) {
        const foe = new Npc(
          r.counter,
          this.npcsType(),
          pos,
          true,
          true,
          true,
          false
        );
        this.npcsCombatStats(foe);
        r.npcs[r.counter] = foe;
        r.counter++;
        foes++;
        //console.log(JSON.stringify(foe, null, 2));
      }
      if (foes >= K.MAX_NPCS) {
        return;
      }
    }
  },
  npcsType: function () {
    const odds = lib.randomInt(1, 10);
    if (odds < 8) {
      return "rat";
    } else {
      return "mole rat";
    }
  },
  npcsCombatStats: function (foe) {
    let data = [[40, 40, 15, 0, 0], [10, 10, 5, 0, 0]];
    let stats = [];
    switch (foe.type) {
      case "rat":
        stats = data[1];
        break;
      case "mole rat":
        stats = data[0];
        break;
    }
    foe.is = {
      ...foe.is,
      lootable: false
    };
    foe.combat = {
      hp: stats[0],
      maxHp: stats[1],
      melee: stats[2],
      range: stats[3],
      defence: stats[4],
    };
  },
};

const aux = {
  randomEmptyPoint: function () {
    let p = { x: 0, y: 0 };
    let found = false;
    let tries = 0;
    while (!found && tries < K.TRIES) {
      let x = lib.randomInt(2, K.MAP_COLS - 2);
      let y = lib.randomInt(2, K.MAP_ROWS - 2);
      if (r.map[x][y].walkable) {
        if (npcs.atPoint(x, y).length === 0) {
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
  },
  updateCam: function () {
    let x = r.pj.pos.x - Math.floor(K.CAM_COLS / 2);
    let y = r.pj.pos.y - Math.floor(K.CAM_ROWS / 2);
    if (x < 0) {
      x = 0;
    } else if (x > K.MAP_COLS - K.CAM_COLS) {
      x = K.MAP_COLS - K.CAM_COLS;
    }
    if (y < 0) {
      y = 0;
    } else if (y > K.MAP_ROWS - K.CAM_ROWS) {
      y = K.MAP_ROWS - K.CAM_ROWS;
    }
    return { x, y };
  },
};

export {
  r,
};

