/* */
'use strict';

import { a } from "./_config.js";
import * as util from "./utils.js";

const cv = document.getElementById('board');
const ctx = cv.getContext('2d');
const ppp = 16;//24;//16; // fails48 on FF but ok in chrome
let cols = 0;
let rows = 0;
const textOffset = ppp / 16;
const fontType = "PressStart2P";
const font = ppp + "px " + fontType;

cv.addEventListener("mouseout", function (e) {
  // need 4 redraws to delete completely last red square
  drawBorderOrGrid(1, "black");//#454545");
  drawBorderOrGrid(1, "black");//#454545");
  drawBorderOrGrid(1, "black");//#454545");
  drawBorderOrGrid(1, "black");//#454545");
});
cv.addEventListener("mousemove", function (e) {
  getMouseOverPosition(cv, e);
});

function drawCellBorder(x, y) {
  drawBorderOrGrid(1, "black");//#454545");
  ctx.strokeStyle = "lightgreen";
  ctx.strokeRect(x * ppp, y * ppp, ppp, ppp);
}

function drawBorderOrGrid(option, color) {
  ctx.lineWidth = 1;
  if (option === 0) {
    ctx.rect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = color;
    ctx.stroke();
    return;
  }
  // draw cols
  ctx.beginPath();
  ctx.strokeStyle = color;
  for (var x = 0; x <= cv.width; x += ppp) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, cv.width);
  }
  ctx.stroke();
  // draw rows
  ctx.beginPath();
  ctx.strokeStyle = color;
  for (var y = 0; y <= cv.height; y += ppp) {
    ctx.moveTo(0, y);
    ctx.lineTo(cv.width, y);
  }
  ctx.stroke();
}

function drawBoard() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tile = a.map.tiles[y][x];
      const color = "#557055";
      drawTile(tile, x, y, color);
    }
  }
}

function drawTile(tile, x, y, color) {
  //  background color
  if (tile.terrain === "wall" && tile.explored) {
    ctx.fillStyle = color;
    ctx.fillRect((x * ppp) + 1, (y * ppp) + 1, ppp - 2, ppp - 2);
  }
  // symbol
  const symbol = util.getMapSymbol(tile.terrain);
  ctx.fillStyle = 'black';
  if (tile.visible) {
    ctx.fillStyle = '#ccc';
  } else if (tile.explored && !tile.visible) {
    ctx.fillStyle = '#454545';
  }
  ctx.fillText(symbol, (x * ppp) + textOffset, ((y + 1) * ppp) + textOffset);
}

function drawEntities() {
  for (let i = a.entities.length - 1; i >= 0; i--) {
    const e = a.entities[i];
    const symbol = util.getMapSymbol(e.name);
    ctx.fillStyle = util.getMapColor(e.name);//'orange';
    const aux = util.convertMapsCoordToCameraCoords(e);
    const x = aux[0];// * ppp;
    const y = aux[1];// * ppp;
    ctx.clearRect((x * ppp) + 1, (y * ppp) + 2, ppp - 2, ppp - 2);
    ctx.fillText(symbol, (x * ppp) + textOffset, ((y + 1) * ppp) + textOffset);
  }
}

function drawUI() {
  const hp = " -- HP: " + a.entities[0].combat.hp;
  document.getElementById("name").innerHTML = a.nick + hp;
  const pos = "Pos " + a.entities[0].pos.X + ":" + a.entities[0].pos.Y;
  document.getElementById("pos").innerHTML = pos;
  const turn = "Turn :" + a.turn;
  document.getElementById("turn").innerHTML = turn;
}

function draw() {
  //console.log("draw");//, data);
  updateDataDraw();
  clearAll();
  drawUI();
  drawBorderOrGrid(1, "black");// "#454545"); // 0 border 1 grid
  drawBoard();
  drawEntities();
}

function getMouseOverPosition(cv, e) {
  const rect = cv.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / ppp);
  const y = Math.floor((e.clientY - rect.top) / ppp);
  drawCellBorder(x, y);
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

export {
  draw
};

