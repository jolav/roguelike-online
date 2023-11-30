/* */

console.log('Loading.....map.js');

import { K, lib } from "./_config.js";

const map = [];

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

function create() {
  //return oneBigRoom();
  return vault();
}

function vault() {
  fillMapWithWalls();
  const rm = createRoomInCenter();
  fillRoom(rm);
  let success = 0;
  for (let tries = 1; tries < K.ROOM_TRIES; tries++) {
    const w = pickRandomWallFromAnyRoom();
    const f = pickRandomFeature();
    const rm = convertFeatureToRoom(w, f);
    if (checkIsRoomForFeature(rm)) {
      fillRoom(rm);
      fillWall(w);
      if (f.type === "room") {
        success++;
      }
      if (success >= K.MAX_ROOMS) {
        tries = K.ROOM_TRIES;
      }
    }
  }
  return map;
}

function createRoomInCenter() {
  const width = lib.randomInt(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
  const height = lib.randomInt(K.MIN_SIZE_ROOM, K.MAX_SIZE_ROOM);
  const x = Math.floor((K.MAP_X - width) / 2);
  const y = Math.floor((K.MAP_Y - height) / 2);
  const rm = new Room(x, y, width, height);
  return rm;
}

function pickRandomWallFromAnyRoom() {
  let found = false;
  let limit = 0;
  const w = new Wall(0, 0, 0, "");
  while (!found && limit < K.ROOM_TRIES) {
    w.x = lib.randomInt(4, K.MAP_X - 5);
    w.y = lib.randomInt(4, K.MAP_Y - 5);
    if (map[w.x][w.y].blocks) {
      getClearNeighbours(w);
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
}

function getClearNeighbours(w) {
  w.nei = 0;
  w.dir = "Zero";
  if (!map[w.x][w.y - 1].blocks) {
    w.nei++;
    w.dir = "S";
  }
  if (!map[w.x][w.y + 1].blocks) {
    w.nei++;
    w.dir = "N";
  }
  if (!map[w.x + 1][w.y].blocks) {
    w.nei++;
    w.dir = "W";
  }
  if (!map[w.x - 1][w.y].blocks) {
    w.nei++;
    w.dir = "E";
  }
}

function pickRandomFeature() {
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
}

function convertFeatureToRoom(w, f) {
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
}

function checkIsRoomForFeature(rm) {
  if (rm.x + rm.width > K.MAP_X - 1 || rm.y + rm.height > K.MAP_Y - 1) {
    return false;
  }
  if (rm.x <= 0 || rm.y <= 0) { // =0 avoid rooms just in the edge
    return false;
  }
  const originX = rm.x;
  const originY = rm.y;
  for (let x = 0; x < rm.width; x++) {
    for (let y = 0; y < rm.height; y++) {
      if (!map[originX + x][originY + y].blocks) {
        return false;
      }
    }
  }
  return true;
}

function fillRoom(rm) {
  const originX = rm.x;
  const originY = rm.y;
  for (let x = 0; x < rm.width; x++) {
    for (let y = 0; y < rm.height; y++) {
      map[originX + x][originY + y] = new Tile("floor");
    }
  }
}

function fillWall(w) {
  map[w.x][w.y] = new Tile("floor");
}

function fillMapWithWalls() {
  for (let x = 0; x < K.MAP_X; x++) {
    map[x] = [];
    for (let y = 0; y < K.MAP_Y; y++) {
      const terrain = "wall";
      map[x].push(
        new Tile(terrain)
      );
    }
  }
}

export {
  create,
};

// TILES

class Tile {
  constructor(terrain) {
    this.createTile(terrain);
  }
  createTile(terrain) {
    let p = [];
    switch (terrain) {
      case "floor":
        p = [terrain, false, false, false, false];
        break;
      case "wall":
        p = [terrain, true, true, false, false];
        break;
      case "unknown":
        p = [terrain, true, true, false, false];
        break;
      default:
        p = [];
    }
    this.terrain = terrain;
    this.blocks = p[1];
    this.blockLOS = p[2];
    this.explored = p[3];
    this.visible = p[4];
  }
}

//
//<!-- testing FOV
//
function oneBigRoom() {
  for (let x = 0; x < K.MAP_X; x++) {
    map[x] = [];
    for (let y = 0; y < K.MAP_Y; y++) {
      let terrain = "floor";
      if (x === 0 || y === 0
        || x === K.MAP_X - 1 || y === K.MAP_Y - 1) {
        terrain = "wall";
      }
      if ((x === 8) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 16) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 24) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 32) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 40) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 48) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 56) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      if ((x === 64) && (y === 5 || y === 10 || y === 15 || y === 20 || y === 25 || y === 30 || y === 35)) {
        terrain = "wall";
      }
      map[x].push(
        new Tile(terrain)
      );
    }
  }
  return map;
}
//
//--> END TESTING FOV
//

