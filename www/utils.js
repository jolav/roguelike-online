/* */
'use strict';

import { a } from "./_config.js";

function convertPlayerCoordsToCamCoords(player) {
  let camX = player.X - Math.floor(a.map.cols / 2);
  let camY = player.Y - Math.floor(a.map.rows / 2);
  if (camX < 0) {
    camX = 0;
  }
  if (camX + a.map.cols > a.map.totalCols) {
    camX = a.map.totalCols - a.map.cols;
  }
  if (camY < 0) {
    camY = 0;
  }
  if (camY + a.map.rows > a.map.totalRows) {
    camY = a.map.totalRows - a.map.rows;
  }
  return [Math.floor(player.X - camX), Math.floor(player.Y - camY)];
}

function convertMapsCoordToCameraCoords(entity) {
  //console.log(entity, camera);
  let camX = entity.pos.X - a.map.camera.X;
  let camY = entity.pos.Y - a.map.camera.Y;
  return [camX, camY];
}

function getMapSymbol(word) {
  if (word.slice(0, 9) === "corpse of") {
    return String.fromCharCode(symbols.get(word.slice(0, 9)));
  }
  return String.fromCharCode(symbols.get(word));
}

const symbols = new Map([
  ["floor", 183],   // middleDot 183 or normal point 46
  ["wall", 35],     // #
  ["-", 0],
  ["player", 64],   // @
  ["rat", 114],     // r
  ["mole rat", 82], // R
  ["corpse of", 37]    // %
]);

function getMapColor(word) {
  if (word.slice(0, 9) === "corpse of") {
    return colors.get(word.slice(10, word.length));
  }
  return colors.get(word);
}

const colors = new Map([
  ["player", "green"],
  ["rat", "purple"],
  ["mole rat", "purple"],
]);

function showTiles() {
  for (let y = 0; y < a.map.tiles.length; y++) {
    let aux = "";
    for (let x = 0; x < a.map.tiles[0].length; x++) {
      aux += a.map.tiles[y][x].terrain + " ";
    }
    console.log(aux);
  }
}

function initializeMultiArray(cols, rows, value) {
  let array = [];
  for (let y = 0; y < rows; y++) {
    array[y] = [];
    for (let x = 0; x < cols; x++) {
      array[y][x] = value;
    }
  }
  return array;
}

export {
  convertMapsCoordToCameraCoords,
  convertPlayerCoordsToCamCoords,
  getMapSymbol,
  getMapColor,
  showTiles,
  initializeMultiArray,
};
