/* */

console.log('Loading...../core/map.js');

import { K } from "./_konfig.js";
import { utils as u } from "./utils.js";

function create(option) {
  switch (option) {
    case 0:
      return testRoom.create(K.CAM_COLS, K.CAM_ROWS);
    case 1:
      return shelter.create(K.MAP_COLS, K.MAP_ROWS);
  }
}

class Room {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Wall {
  constructor(x, y, nei, dir) {
    this.x = x;
    this.y = y;
    this.nei = nei;
    this.dir = dir;
  }
}

class Feature {
  constructor(width, height, type) {
    this.width = width;
    this.height = height;
    this.type = type;
  }
}

class Tile {
  constructor(terrain) {
    this.createTile(terrain);
  }
  createTile(terrain) {
    let p = [];
    switch (terrain) {
      case "floor":
        p = [terrain, true, false, false, false];
        break;
      case "wall":
        p = [terrain, false, true, false, false];
        break;
      case "unknown":
        p = [terrain, false, true, false, false];
        break;
      default:
        p = [];
    }
    this.terrain = terrain;
    this.walkable = p[1];
    this.blockLOS = p[2];
    this.explored = p[3];
    this.visible = p[4];
  }
}

const shelter = {
  map: [],
  create: function (cols, rows) {
    console.log('INDIRECTA');
    return testRoom.create(cols, rows);
  }
};

///////////////////////////////
////////// TEST ROOM //////////
///////////////////////////////

const testRoom = {
  map: [],
  create: function (cols, rows) {
    this.fillMapWithWalls(cols, rows);
    this.cleanRoom(cols, rows);
    this.putColumns(50, cols, rows);
    return this.map;
  },
  fillMapWithWalls: function (cols, rows) {
    for (let x = 0; x < cols; x++) {
      this.map[x] = [];
      for (let y = 0; y < rows; y++) {
        const terrain = "wall";
        this.map[x].push(
          new Tile(terrain)
        );
      }
    }
  },
  cleanRoom: function (cols, rows) {
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if (x !== 0 && y !== 0 && x !== cols - 1 && y !== rows - 1) {
          this.map[x][y] = new Tile("floor");
        }
      }
    }
  },
  putColumns: function (many, cols, rows) {
    for (let c = 0; c < many; c++) {
      const a = u.randomInt(1, cols - 1);
      const b = u.randomInt(1, rows - 1);
      if (this.map[a][b].walkable) {
        this.map[a][b] = new Tile("wall");
      }
    }
  }
};

export {
  create,
};
