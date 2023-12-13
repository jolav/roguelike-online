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
  gameOver: {
    status: false,
    win: false,
  },
  counter: 0,
  turn: 0,
  date: lib.currentDate(0),
  entities: [],
  map: map.create(),
  history: ["9", "8", "7", "6", "5", "4", "3", "2", "1", "Adventure begins..."],
  start: function () {
    populateMap();
    fov.playerLOS();
    render.redraw();
  },
  newTurn: function (action) {
    const endTurnActions = ["up", "down", "left", "right", "skip", "fire"];
    if (!endTurnActions.includes(action)) {
      r.entities[0][action]();
      render.redraw();
      if (r.gameOver.status) {
        gameOver();
      }
      return;
    }
    r.turn++;
    r.date = lib.currentDate(r.turn);
    es.turn(action);
    fov.playerLOS();
    render.redraw();
    if (r.gameOver.status) {
      gameOver();
    }
  },
};

function populateMap() {
  r.entities[0] = createPlayer();
  r.counter++;
  foes.create();
  items.create();
  createExit();
  //console.log(r.entities);
}

const foes = {
  create: function () {
    for (let tries = 0; tries < K.FOES_TRIES; tries++) {
      let p = getRandomEmptyPoint();
      if (p !== undefined) {
        const foe = new e(r.counter, foes.type(), p, true, true, true, false);
        if (foe.isCombatant()) {
          this.combatStats(foe);
        }
        r.entities[r.counter] = foe;
        r.counter++;
      }
      if (r.counter >= K.MAX_FOES) {
        return;
      }
    }
  },
  type: function () {
    const odds = lib.randomInt(1, 10);
    if (odds < 8) {
      return "rat";
    } else {
      return "mole rat";
    }
  },
  combatStats: function (foe) {
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
      lootable: false
    };
    foe.combat = {
      hp: stats[0],
      maxHp: stats[1],
      melee: stats[2],
      range: stats[3],
      defence: stats[4],
    };
  }
};

const items = {
  create: function () {
    let items = 0;
    for (let tries = 0; tries < K.ITEMS_TRIES; tries++) {
      let p = getRandomEmptyPoint();
      if (p !== undefined) {
        const item = new e(r.counter, this.getType(), p, false, false, false, true);
        this.takeItemStats(item);
        r.entities[r.counter] = item;
        r.counter++;
        items++;
      }
      if (items >= K.MAX_ITEMS) {
        return;
      }
    }
  },
  getType: function () {
    const odds = lib.randomInt(1, 10);
    switch (odds) {
      case 1:
      case 2:
      case 3:
        return "food";
      case 4:
      case 5:
        return "supply";
      case 6:
      case 7:
        return "medical";
      case 8:
        return "melee";
      case 9:
        return "firearm";
      case 10:
        return "body";
    }
  },
  takeItemStats: function (item) {
    item.is = {
      visible: true,
      lootable: true,
      consumable: false,
      equippable: false,
      equipped: false,
    };
    item.data = {};
    switch (item.type) {
      case "food":
        item.data.qty = lib.randomInt(1, 6);
        item.is.consumable = true;
        break;
      case "supply":
        item.data.qty = lib.randomInt(1, 3);
        item.is.consumable = true;
        break;
      case "medical":
        item.data.qty = lib.randomInt(1, 3);
        item.is.consumable = true;
        break;
      case "firearm":
        item.data.name = "Pistol 9mm";
        item.data.range = 6 + lib.randomInt(1, 4);
        item.is.equippable = true;
        break;
      case "melee":
        item.data.name = "Baseball Bat";
        item.data.melee = 8 + lib.randomInt(1, 4);
        item.is.equippable = true;
        break;
      case "body":
        item.data.name = "Cloth";
        item.data.defence = 2 + lib.randomInt(1, 4);
        item.is.equippable = true;
    }
    //console.log(JSON.stringify(item));
  }
};

function createPlayer() {
  //const x = Math.floor(K.MAP_X / 2);
  //const y = Math.floor(K.MAP_Y / 2);
  //const pos = { x, y };
  const pos = getRandomEmptyPoint();
  const player = new e(r.counter, "player", pos, true, true, true, false);
  const stats = [180, 200, 6, 0, 0];
  player.combat = {
    hp: stats[0],
    maxHp: stats[1],
    melee: stats[2],
    range: stats[3],
    defence: stats[4],
  };
  player.inventory = {
    food: 0,
    supply: 0,
    medical: 0
  };
  player.equipment = {
    head: undefined,
    body: undefined,
    melee: undefined,
    range: undefined,
  };
  player.targets = {
    when: r.turn - 1,
    who: -1,
    foes: [],
  };
  //console.log(JSON.stringify(player, null, 2));
  return player;
}

function createExit() {
  const pos = getRandomEmptyPoint();
  const item = new e(r.counter, "exit", pos, false, false, false, true);
  item.is = {
    visible: false,
    lootable: false,
    consumable: false,
    equippable: false,
    equipped: false,
  };
  r.entities[r.counter] = item;
  r.counter++;
}

function gameOver() {
  if (r.gameOver.win) {
    console.log('THIS IS A VICTORY');
    alert('YOU LEAVE THE VAULT');
  }
  if (!r.gameOver.win) {
    console.log('THIS IS THE END');
    alert('YOU LOSE');
  }
  location.reload();

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
        const resp = es.atPoint(x, y);
        if (resp.length === 0) {
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
}

export {
  r,
};

