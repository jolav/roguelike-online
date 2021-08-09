/* */
'use strict';

import { a } from "./_config.js";
import * as util from "./utils.js";

const cv = document.getElementById('board');
const ctx = cv.getContext('2d');
const ppp = 16;
let cols = 0;
let rows = 0;
let graphOffset = 0;
const fontType = "PressStart2P";
const font = ppp + "px " + fontType;

function drawBoard() {
  graphOffset = 0;// ppp / 8; arial in axis Y
  for (let y = 0; y < cv.height; y += ppp) {
    for (let x = 0; x < cv.width; x += ppp) {
      const tile = a.map.tiles[y / ppp][x / ppp];
      const symbol = util.getMapSymbol(tile.terrain);
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      //  background color
      if (tile.terrain === "wall" && tile.explored) { // CHEAT
        ctx.fillStyle = "#557055";
        ctx.fillRect(x - 1, y - 1, ppp, ppp);
      }
      // symbol
      ctx.fillStyle = 'black';
      if (tile.visible) {
        ctx.fillStyle = '#ccc';
      } else if (tile.explored && !tile.visible) {
        ctx.fillStyle = '#454545';
      }
      ctx.fillText(symbol, x + (ppp / 2), y + (ppp / 2) + graphOffset);
    }
  }
}

function drawBorderOrGrid(option) {
  if (option === 0) {
    ctx.rect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = '#454545';
    ctx.stroke();
    return;
  }
  // draw cols
  ctx.beginPath();
  ctx.strokeStyle = '#454545';
  for (var x = 0; x <= cv.width; x += ppp) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, cv.width);
  }
  ctx.stroke();
  // draw rows
  ctx.beginPath();
  ctx.strokeStyle = '#454545';
  for (var y = 0; y <= cv.height; y += ppp) {
    ctx.moveTo(0, y);
    ctx.lineTo(cv.width, y);
  }
  ctx.stroke();
}

function drawPlayer() {
  ctx.fillStyle = 'green';
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  let player = a.entities[0].pos;
  const symbol = util.getMapSymbol("player");
  graphOffset = ppp / 2;
  const aux = util.convertPlayerCoordsToCamCoords(player);
  player.X = aux[0] * ppp;
  player.Y = aux[1] * ppp;
  // delete grid in player pos
  ctx.clearRect(player.X + 2, player.Y + 2, ppp - 5, ppp - 5);
  ctx.fillText(symbol, player.X + graphOffset, player.Y + graphOffset);
}

function drawUI() {
  document.getElementById("name").innerHTML = a.nick;
  const pos = "Pos " + a.entities[0].pos.X + ":" + a.entities[0].pos.Y;
  document.getElementById("pos").innerHTML = pos;
  const turn = "Turn :" + a.turn;
  document.getElementById("turn").innerHTML = turn;
}

function clearAll() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.beginPath();
}

function updateDataDraw() {
  cols = a.map.cols;
  rows = a.map.rows;
  cv.width = cols * ppp;
  cv.height = rows * ppp;
  ctx.font = font;
  ctx.strokeStyle = '#454545';
  ctx.fillStyle = '#454545';
}

function draw() {
  //console.log("draw");//, data);
  updateDataDraw();
  clearAll();
  drawUI();
  drawBorderOrGrid(0); // 0 border 1 grid
  drawBoard();
  drawPlayer();
}

export {
  draw
};
