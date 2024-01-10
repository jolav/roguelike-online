/* */

console.log('Loading...../server/map.js');

import { K, lib } from "./_conf.js";

function create() {
  //Only for dev make map same size as browser actual size
  if (window.location.hostname === K.DEV) {
    return shelter2.create();
  }
  //-------------------------------------------------------
  return shelter.create();
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
  create: function () {
    this.fillMapWithWalls();
    const rm = this.createRoomInCenter();
    this.fillRoom(rm);
    let success = 0;
    for (let tries = 1; tries < K.TRIES; tries++) {
      const w = this.pickRandomWallFromAnyRoom();
      const f = this.pickRandomFeature();
      const rm = this.convertFeatureToRoom(w, f);
      if (this.checkIsRoomForFeature(rm)) {
        this.fillRoom(rm);
        this.fillWall(w);
        if (f.type === "room") {
          success++;
        }
        if (success >= K.MAX_ROOMS) {
          tries = K.TRIES;
        }
      }
    }
    return this.map;
  },
  createRoomInCenter: function () {
    const width = lib.randomInt(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
    const height = lib.randomInt(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
    const x = Math.floor((K.MAP_COLS - width) / 2);
    const y = Math.floor((K.MAP_ROWS - height) / 2);
    const rm = new Room(x, y, width, height);
    return rm;
  },
  pickRandomWallFromAnyRoom: function () {
    let found = false;
    let limit = 0;
    const w = new Wall(0, 0, 0, "");
    while (!found && limit < K.TRIES) {
      w.x = lib.randomInt(4, K.MAP_COLS - 5);
      w.y = lib.randomInt(4, K.MAP_ROWS - 5);
      if (!this.map[w.x][w.y].walkable) {
        this.getClearNeighbours(w);
        if (w.nei === 1) {
          found = true;
        }
      }
      limit++;
    }
    if (found) {
      return w;
    }
    return [0, 0, 0, ""];
  },
  getClearNeighbours: function (w) {
    w.nei = 0;
    w.dir = "Zero";
    if (this.map[w.x][w.y - 1].walkable) {
      w.nei++;
      w.dir = "S";
    }
    if (this.map[w.x][w.y + 1].walkable) {
      w.nei++;
      w.dir = "N";
    }
    if (this.map[w.x + 1][w.y].walkable) {
      w.nei++;
      w.dir = "W";
    }
    if (this.map[w.x - 1][w.y].walkable) {
      w.nei++;
      w.dir = "E";
    }
  },
  pickRandomFeature: function () {
    const rnd = lib.randomInt(1, 100);
    const f = new Feature(0, 0, "");
    switch (rnd < K.CORRIDOR_ODDS) {
      case true:
        f.width = 1;
        f.height = lib.randomInt(K.MIN_LENGTH_CORRIDOR, K.MAX_LENGTH_CORRIDOR);
        f.type = "corridor";
        break;
      case false:
        f.width = lib.randomInt(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
        f.height = lib.randomInt(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
        f.type = "room";
    }
    return f;
  },
  convertFeatureToRoom: function (w, f) {
    const rm = new Room(0, 0, 0, 0);
    switch (w.dir) {
      case "N":
        rm.x = w.x - Math.floor(f.width / 2);
        rm.y = w.y - f.height;
        rm.width = f.width;
        rm.height = f.height;
        break;
      case "S":
        rm.x = w.x - Math.floor(f.width / 2);
        rm.y = w.y + 1;
        rm.width = f.width;
        rm.height = f.height;
        break;
      case "E":
        rm.x = w.x + 1;
        rm.y = w.y - Math.floor(f.width / 2);
        rm.width = f.height;
        rm.height = f.width;
        break;
      case "W":
        rm.x = w.x - f.height;
        rm.y = w.y - Math.floor(f.width / 2);
        rm.width = f.height;
        rm.height = f.width;
    }
    return rm;
  },
  checkIsRoomForFeature: function (rm) {
    if (rm.x + rm.width > K.MAP_COLS - 1 || rm.y + rm.height > K.MAP_ROWS - 1) {
      return false;
    }
    if (rm.x <= 0 || rm.y <= 0) { // =0 avoid rooms just in the edge
      return false;
    }
    const originX = rm.x;
    const originY = rm.y;
    for (let x = 0; x < rm.width; x++) {
      for (let y = 0; y < rm.height; y++) {
        if (this.map[originX + x][originY + y].walkable) {
          return false;
        }
      }
    }
    return true;
  },
  fillRoom: function (rm) {
    const originX = rm.x;
    const originY = rm.y;
    for (let x = 0; x < rm.width; x++) {
      for (let y = 0; y < rm.height; y++) {
        this.map[originX + x][originY + y] = new Tile("floor");
      }
    }
  },
  fillWall: function (w) {
    this.map[w.x][w.y] = new Tile("floor");
  },
  fillMapWithWalls: function () {
    for (let x = 0; x < K.MAP_COLS; x++) {
      this.map[x] = [];
      for (let y = 0; y < K.MAP_ROWS; y++) {
        const terrain = "wall";
        this.map[x].push(
          new Tile(terrain)
        );
      }
    }
  }
};

const shelter2 = { // one big room
  map: [],
  create: function name() {
    this.fillMapWithWalls();
    this.cleanRoom();
    this.putColumns(20);
    return this.map;
  },
  fillMapWithWalls: function () {
    for (let x = 0; x < K.MAP_COLS; x++) {
      this.map[x] = [];
      for (let y = 0; y < K.MAP_ROWS; y++) {
        const terrain = "wall";
        this.map[x].push(
          new Tile(terrain)
        );
      }
    }
  },
  cleanRoom: function () {
    for (let x = 0; x < K.MAP_COLS; x++) {
      for (let y = 0; y < K.MAP_ROWS; y++) {
        if (x !== 0 && y !== 0 && x !== K.MAP_COLS - 1 && y !== K.MAP_ROWS - 1) {
          this.map[x][y] = new Tile("floor");
        }
      }
    }
  },
  putColumns: function (many) {
    for (let c = 0; c < many; c++) {
      const a = lib.randomInt(1, K.MAP_COLS - 1);
      const b = lib.randomInt(1, K.MAP_ROWS - 1);
      if (this.map[a][b].walkable) {
        this.map[a][b] = new Tile("wall");
      }
    }
  }
};

export {
  create,
};

