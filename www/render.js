/* */
'use strict';

import { a } from "./_config.js";

const cv = document.getElementById('board');
const ctx = cv.getContext('2d');
const ppp = 32;
const cols = 21;
const rows = 11;
const fontType = "PressStart2P";
const font = ppp + "px " + fontType;
cv.width = cols * ppp;
cv.height = rows * ppp;

function drawBoard() {
  const middelDotDeviation = ppp / 8;
  for (let y = 0; y < cv.height; y += ppp) {
    for (let x = 0; x < cv.width; x += ppp) {
      //ctx.fillStyle = '#454545';
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      // middledot = \u00B7 or String.fromCharCode(183)
      ctx.fillText("\u00B7", x + (ppp / 2), y + (ppp / 2) + middelDotDeviation);
    }
  }
}

function drawBorderOrGrid(option) {
  if (option === 0) {
    ctx.rect(0, 0, cv.width, cv.height);
    //ctx.strokeStyle = '#454545';
    ctx.stroke();
    return;
  }

  // draw cols
  ctx.beginPath();
  //ctx.strokeStyle = '#454545';
  for (var x = 0; x <= cv.width; x += ppp) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, cv.width);
  }
  ctx.stroke();

  // draw rows
  ctx.beginPath();
  //ctx.strokeStyle = '#454545';
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
  const centerPlayer = ppp / 2;
  player.X = player.X * ppp;
  player.Y = player.Y * ppp;
  // delete grid in player pos
  ctx.clearRect(player.X + 1, player.Y + 1, ppp - 1, ppp - 1);
  ctx.fillText("@", player.X + centerPlayer, player.Y + centerPlayer);
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

function draw() {
  //console.log("draw");//, data);
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
