/* */

console.log('Loading.....game.js');

import * as render from "./render_ascii.js";
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
    this.populateMap();
    fov.playerLOS();
    this.draw();
  },
  newTurn: function (action) {
    const player = r.entities[0];
    const notConsumingTurnActions = ["selectFoe"];
    if (notConsumingTurnActions.includes(action)) {
      player[action]();
      this.draw();
      return;
    }
    es.turn(action);
    fov.playerLOS();
    this.draw();
    this.turn++;
    this.date = lib.currentDate(this.turn);
    if (this.gameOver.status) {
      gameOver();
    }
  },
  populateMap: function () {
    character.create();
    foes.create();
    items.create();
    createExit();
    //console.log(this.entities);
  },
  draw: function () {
    const options = [render.ascii];
    options[K.RENDER_TYPE]();
  }
};

const foes = {
  create: function () {
    let foes = 0;
    for (let tries = 0; tries < K.FOES_TRIES; tries++) {
      let pos = aux.randomEmptyPoint();
      if (pos !== undefined) {
        const foe = new e(r.counter, this.type(), pos, true, true, true, false);
        this.combatStats(foe);
        r.entities[r.counter] = foe;
        r.counter++;
        foes++;
        //console.log(JSON.stringify(foe, null, 2));
      }
      if (foes >= K.MAX_FOES) {
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
  }
};

const items = {
  create: function () {
    let items = 0;
    for (let tries = 0; tries < K.ITEMS_TRIES; tries++) {
      let pos = aux.randomEmptyPoint();
      if (pos !== undefined) {
        const item = new e(r.counter, this.type(), pos, false, false, false, true);
        this.itemStats(item);
        r.entities[r.counter] = item;
        r.counter++;
        items++;
        //console.log(JSON.stringify(item, null, 2));
      }
      if (items >= K.MAX_ITEMS) {
        return;
      }
    }
  },
  type: function () {
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
  itemStats: function (item) {
    item.is = {
      ...item.is,
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
        item.data.range = 4 + lib.randomInt(1, 4);
        item.is.equippable = true;
        break;
      case "melee":
        item.data.name = "Baseball Bat";
        item.data.melee = 6 + lib.randomInt(1, 4);
        item.is.equippable = true;
        break;
      case "body":
        item.data.name = "Cloth";
        item.data.defence = 2 + lib.randomInt(1, 4);
        item.is.equippable = true;
    }
  }
};

const character = {
  create: function () {
    const pos = aux.randomEmptyPoint();
    const player = new e(r.counter, "player", pos, true, true, true, false);
    const stats = [180, 200, 4, 0, 0];
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
    r.entities[0] = player;
    r.counter++;
  }
};

function createExit() {
  const pos = aux.randomEmptyPoint();
  const item = new e(r.counter, "exit", pos, false, false, false, true);
  item.is = {
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

export {
  r,
};

const aux = {
  randomEmptyPoint: function () {
    let p = { x: 0, y: 0 };
    let found = false;
    let tries = 0;
    while (!found && tries < K.FOES_TRIES) {
      let x = lib.randomInt(2, K.MAP_X - 2);
      let y = lib.randomInt(2, K.MAP_Y - 2);
      if (r.map[x][y].walkable) {
        if (es.atPoint(x, y).length === 0) {
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
};

