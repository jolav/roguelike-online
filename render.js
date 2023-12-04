/* */

console.log('Loading.....render.js');

import { K, lib } from "./_config.js";
import { r } from "./run.js";

const canvas = document.getElementById(K.CANVAS_NAME);
canvas.width = K.WINDOW_WIDTH;
canvas.height = K.WINDOW_HEIGHT;
const textOffset = K.PPP;
const ctx = canvas.getContext('2d');
ctx.font = K.PPP + "px " + K.FONT;
ctx.fillStyle = "black";

let player;

function redraw() {
  player = r.entities[0].pos;
  cam.update();
  draw.clearAll();
  //draw.map();
  draw.camera();
  draw.entities();
  //draw.player();
  panel.update();
}

const cam = {
  x: 0,
  y: 0,
  maxX: K.MAP_X - K.CAM_X,
  maxY: K.MAP_Y - K.CAM_Y,
  update: function () {
    this.x = player.x - Math.floor(K.CAM_X / 2);
    this.y = player.y - Math.floor(K.CAM_Y / 2);
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
        const tile = r.map[posX][posY];
        const char = lib.mapSymbol(tile.terrain);
        if (tile.visible) {
          this.tile(x, y, char, "visible");
        } else if (tile.explored && !tile.visible) {
          this.tile(x, y, char, "explored");
        }
      }
    }
  },
  entities: function () {
    for (let e of r.entities) {
      const posX = e.pos.x - cam.x + K.DELTA_X;
      const posY = e.pos.y - cam.y + K.DELTA_Y;
      const tile = r.map[e.pos.x][e.pos.y];
      if (tile.visible) {
        const char = lib.mapSymbol(e.type);
        const color = e.type;
        this.clearTile(posX, posY);
        this.tile(posX, posY, char, color);
      }
    }
  },
  tile: function (x, y, char, color) {
    ctx.fillStyle = lib.colorOfEntity(color);
    ctx.textAlign = "center";
    ctx.fillText(char, x * K.PPP + textOffset / 2, y * K.PPP + textOffset / 2);
  },

  clearAll: function () {
    ctx.clearRect(0, 0, K.WINDOW_WIDTH, K.WINDOW_HEIGHT);
    ctx.beginPath();
  },
  clearTile: function (x, y) {
    ctx.clearRect(x * K.PPP, y * K.PPP, K.PPP, K.PPP);
    ctx.beginPath();
  },
  player: function () {
    const posX = player.x - cam.x + K.DELTA_X;
    const posY = player.y - cam.y + K.DELTA_Y;
    this.clearTile(posX, posY);
    const char = lib.mapSymbol("player");
    this.tile(posX, posY, char, "player");
  },
  map: function () {
    for (let x = 0; x < K.MAP_X; x++) {
      for (let y = 0; y < K.MAP_Y; y++) {
        const char = lib.mapSymbol(r.map[x][y].terrain);
        this.tile(x, y, char, "visible");
      }
    }
    this.clearTile(player.x, player.y);
    const char = lib.mapSymbol("player");
    this.tile(player.x, player.y, char, "player");
  },
};

const panel = {
  update: function () {
    this.currentTime();
    this.pjPos();
  },
  pjPos: function () {
    document.getElementById("pjX").innerHTML = player.x;
    document.getElementById("pjY").innerHTML = player.y;
  },
  currentTime: function () {
    let aa = r.date.toDateString().slice(4);
    let bb = r.date.toTimeString().split(" ")[0];
    document.getElementById("date").innerHTML = aa;
    document.getElementById("time").innerHTML = bb;
  }
};

export {
  redraw,
};
