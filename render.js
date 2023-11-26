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
  cam.update();
  draw.clearAll();
  //draw.map();
  draw.camera();
  draw.player();
  panel.update();
}

const cam = {
  x: 0,
  y: 0,
  maxX: K.MAP_X - K.CAM_X,
  maxY: K.MAP_Y - K.CAM_Y,
  update: function () {
    this.x = pj.x - Math.floor(K.CAM_X / 2);
    this.y = pj.y - Math.floor(K.CAM_Y / 2);
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > this.maxX) {
      this.x = this.maxX;
    }
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > this.maxY) {
      this.y = this.maxY;
    }
  },
};

const draw = {
  camera: function () {
    for (let x = K.DELTA_X; x < K.CAM_X + K.DELTA_X; x++) {
      for (let y = K.DELTA_Y; y < K.CAM_Y + K.DELTA_Y; y++) {
        const posX = x + cam.x - K.DELTA_X;
        const posY = y + cam.y - K.DELTA_Y;
        const char = lib.getCharCode(a.map[posX][posY].terrain);
        this.tile(x, y, char);
      }
    }
  },
  map: function () {
    for (let x = 0; x < K.MAP_X; x++) {
      for (let y = 0; y < K.MAP_Y; y++) {
        const char = lib.getCharCode(a.map[x][y].terrain);
        this.tile(x, y, char);
      }
    }
  },
  tile: function (x, y, char) {
    ctx.fillStyle = "#fff";
    ctx.fillText(char, x * K.PPP, y * K.PPP + textOffset);
  },
  player: function () {
    const posX = pj.x - cam.x + K.DELTA_X;
    const posY = pj.y - cam.y + K.DELTA_Y;
    this.clearTile(posX, posY);
    const char = lib.getCharCode("player");
    this.tile(posX, posY, char);
  },
  clearAll: function () {
    ctx.clearRect(0, 0, K.WINDOW_WIDTH, K.WINDOW_HEIGHT);
    ctx.beginPath();
  },
  clearTile: function (x, y) {
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
