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
  player = r.entities[0];
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
    this.x = player.pos.x - Math.floor(K.CAM_X / 2);
    this.y = player.pos.y - Math.floor(K.CAM_Y / 2);
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
    const posX = player.pos.x - cam.x + K.DELTA_X;
    const posY = player.pos.y - cam.y + K.DELTA_Y;
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
    this.clearTile(player.pos.x, player.pos.y);
    const char = lib.mapSymbol("player");
    this.tile(player.pos.x, player.pos.y, char, "player");
  },
};

const panel = {
  update: function () {
    this.currentTime();
    this.pjPos();
    this.stats();
    this.history();
  },
  pjPos: function () {
    document.getElementById("pjX").innerHTML = player.pos.x;
    document.getElementById("pjY").innerHTML = player.pos.y;
  },
  currentTime: function () {
    let aa = r.date.toDateString().slice(4);
    let bb = r.date.toTimeString().split(" ")[0];
    document.getElementById("date").innerHTML = aa;
    document.getElementById("time").innerHTML = bb;
  },
  stats: function () {
    const health = player.stats.hp + "/" + player.stats.maxHp;
    document.getElementById("hp").innerHTML = health;
    document.getElementById("dmg").innerHTML = player.stats.dmg;
    document.getElementById("def").innerHTML = player.stats.def;
  },
  history: function () {
    const h = [];
    for (let line = 1; line <= 6; line++) {
      const index = r.history.length - line;
      h.push(r.history[index]);
    }
    document.getElementById("h1").innerHTML = h[0];
    document.getElementById("h2").innerHTML = h[1];
    document.getElementById("h3").innerHTML = h[2];
    document.getElementById("h4").innerHTML = h[3];
    document.getElementById("h5").innerHTML = h[4];
    document.getElementById("h6").innerHTML = h[5];
  }
};

export {
  redraw,
};
