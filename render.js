/* */

console.log('Loading.....render.js');

import { K, lib } from "./_config.js";
import { a, pj } from "./game.js";

let canvas = document.getElementById(K.CANVAS_NAME);
canvas.width = K.WINDOW_WIDTH;
canvas.height = K.WINDOW_HEIGHT;
const textOffset = K.PPP; // 16,24,32 ...
const ctx = canvas.getContext('2d');
ctx.font = K.PPP + "px " + K.FONT;

function redraw() {
  draw.clearAll();
  draw.drawMap();
  draw.drawPlayer();
  panel.update();
}

const draw = {
  drawMap: function () {
    for (let col = 0; col < K.COLS; col++) {
      for (let row = 0; row < K.ROWS; row++) {
        const char = lib.getCharCode(a.map[col][row].terrain);
        this.drawTile(col, row, char);
      }
    }
  },
  drawTile: function (x, y, char) {
    ctx.fillStyle = "#fff";
    ctx.fillText(char, x * K.PPP, y * K.PPP + textOffset);
  },
  drawPlayer: function () {
    this.clearTile(pj.x, pj.y);
    const char = lib.getCharCode("player");
    this.drawTile(pj.x, pj.y, char);
  },
  clearAll: function () {
    ctx.clearRect(0, 0, K.WINDOW_WIDTH, K.WINDOW_HEIGHT);
    ctx.beginPath();
  },
  clearTile: function (x, y) {
    ctx.fillStyle = "red";
    ctx.clearRect(x * K.PPP, y * K.PPP, K.PPP, K.PPP);
    ctx.beginPath();
  },
};

const panel = {
  update: function () {
    this.currentTime();
    this.pjPos();
  },
  pjPos: function () {
    document.getElementById("pjX").innerHTML = pj.x;
    document.getElementById("pjY").innerHTML = pj.y;
  },
  currentTime: function () {
    let aa = a.date.toDateString().slice(4);
    let bb = a.date.toTimeString().split(" ")[0];
    document.getElementById("date").innerHTML = aa;
    document.getElementById("time").innerHTML = bb;
  }
};

export {
  redraw
};
