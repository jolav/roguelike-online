/* */

console.log('Loading.....render_ascii.js');

import { K } from "./_config.js";
import { r } from "./run.js";
import * as panel from "./panel.js";

const canvas = document.getElementById(K.CANVAS_NAME);
canvas.width = K.WINDOW_WIDTH;
canvas.height = K.WINDOW_HEIGHT;
canvas.last = [];
const textOffset = K.PPP;
const ctx = canvas.getContext('2d');
//ctx.textBaseline = "middle";
ctx.textBaseline = "ideographic"; // remove divide by two en tile Y, 117
ctx.font = K.PPP + "px " + K.FONT;
ctx.fillStyle = "black";

let player;

function ascii() {
  //console.log('Render ASCII');
  player = r.entities[0];
  cam.update();
  draw.clearAll();
  draw.camera();
  draw.entities();
  if (player.targets.who !== -1 && player.targets.foes.length > 0) {
    draw.tileSelected();
  }
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
        const char = aux.mapSymbol(tile.terrain);
        if (tile.visible) {
          this.tile(x, y, char, "visible");
        } else if (tile.explored) {
          this.tile(x, y, char, "explored");
        }
      }
    }
  },
  entities: function () {
    for (let e of r.entities) {
      if (e.id === 0) {
        continue;
      }
      const posX = e.pos.x - cam.x + K.DELTA_X;
      const posY = e.pos.y - cam.y + K.DELTA_Y;
      const tile = r.map[e.pos.x][e.pos.y];
      if (tile.visible) {
        let char = aux.mapSymbol(e.type);
        let color = e.type;
        if (e.is.item) {
          color = "item";
          char = aux.mapSymbol("item");
        }
        this.clearTile(posX, posY);
        this.tile(posX, posY, char, color);
      }
    }
    this.player();
  },
  player: function () {
    const posX = player.pos.x - cam.x + K.DELTA_X;
    const posY = player.pos.y - cam.y + K.DELTA_Y;
    this.clearTile(posX, posY);
    const char = aux.mapSymbol("player");
    this.tile(posX, posY, char, "player");
  },
  tile: function (x, y, char, color) {
    ctx.fillStyle = aux.colorOfEntity(color);
    ctx.textAlign = "center";
    ctx.fillText(char, x * K.PPP + textOffset / 2, y * K.PPP + textOffset);
  },
  clearAll: function () {
    ctx.clearRect(0, 0, K.WINDOW_WIDTH, K.WINDOW_HEIGHT);
    ctx.beginPath();
  },
  clearTile: function (x, y) {
    ctx.clearRect(x * K.PPP, y * K.PPP, K.PPP, K.PPP);
    ctx.beginPath();
  },
  tileSelected: function (x, y) {
    const t = player.targets;
    x = t.foes[t.who].pos.x;
    y = t.foes[t.who].pos.y;
    ctx.strokeStyle = "lightgreen";
    ctx.strokeRect((x - cam.x) * K.PPP, (y - cam.y) * K.PPP, K.PPP, K.PPP);
  },
};

export {
  ascii,
};

const aux = {
  mapSymbol: function (symbol) {
    if (symbol.slice(0, 9) === "corpse of") {
      return String.fromCharCode(symbols.get(symbol.slice(0, 9)));
    }
    return String.fromCharCode(symbols.get(symbol));
  },
  colorOfEntity: function (entity) {
    const color = colors.get(entity);
    return color;
  },
};

const symbols = new Map([
  ["floor", 183],   // middleDot 183 or normal point 46
  ["wall", 35],     // #
  ["-", 0],
  ["player", 64],   // @
  ["rat", 114],     // r
  ["mole rat", 82], // R
  ["corpse of", 37],    // %
  ["item", 63],    // ?
  ["exit", 60], // <
]);

const colors = new Map([
  ["player", "burlywood"],
  ["visible", "#fff"],
  ["explored", "#454545"],
  ["rat", "DeepPink"],
  ["mole rat", "DeepPink"],
  ["item", "orange"],
  ["exit", "yellow"],
]);

