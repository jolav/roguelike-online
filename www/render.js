/* */
'use strict';

import { a, getMapSymbol } from "./_config.js";

const cv = document.getElementById('board');
const ctx = cv.getContext('2d');
const ppp = 32;
let cols = 0;
let rows = 0;
const fontType = "PressStart2P";
const font = ppp + "px " + fontType;

function drawBoard() {
  const middelDotDeviation = ppp / 8;
  for (let y = 0; y < cv.height; y += ppp) {
    for (let x = 0; x < cv.width; x += ppp) {
      //ctx.fillStyle = '#454545';
      const terrain = a.map.tiles[y / ppp][x / ppp].terrain;
      const symbol = getMapSymbol(terrain);
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(symbol, x + (ppp / 2), y + (ppp / 2) + middelDotDeviation);
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
  const player = a.entities[0].pos;
  const symbol = getMapSymbol("player");
  const centerPlayer = ppp / 2;
  player.X = player.X * ppp;
  player.Y = player.Y * ppp;
  // delete grid in player pos
  ctx.clearRect(player.X + 2, player.Y + 2, ppp - 5, ppp - 5);
  ctx.fillText(symbol, player.X + centerPlayer, player.Y + centerPlayer);
}

function drawUI() {
  document.getElementById("name").innerHTML = a.nick;
  const pos = "Pos " + a.entities[0].pos.X + ":" + a.entities[0].pos.Y;
  document.getElementById("pos").innerHTML = pos;
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
}

function draw() {
  //console.log("draw");//, data);
  updateDataDraw();
  ctx.font = font;
  ctx.strokeStyle = '#454545';
  ctx.fillStyle = '#454545';
  clearAll();
  drawUI();
  drawBorderOrGrid(0); // 0 border 1 grid
  drawBoard();
  drawPlayer();
}

export {
  draw
};
