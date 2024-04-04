/* */

console.log('Loading.....render_ascii.js');

import { c, lib } from "./_config.js";
import { t } from "./http.js";
import * as panel from "./panel.js";

const canvas = document.getElementById(c.CANVAS_NAME);
canvas.width = (c.CAM_COLS * c.PPP) + (2 * c.CAM_DELTA_X);
canvas.height = (c.CAM_ROWS * c.PPP) + (2 * c.CAM_DELTA_Y);
const pH = c.CAM_DELTA_X;
const pV = c.CAM_DELTA_Y;
const ctx = canvas.getContext("2d");
ctx.textBaseline = "top";
ctx.textAlign = "center";
ctx.font = c.PPP + "px " + c.FONT[1];

function ascii() {
  const oX = Math.floor((c.CAM_COLS - t.view.length) / 2);
  const oY = Math.floor((c.CAM_ROWS - t.view[0].length) / 2);
  //console.log(oX, oY);
  draw.clearAll();
  draw.grid();
  draw.map(oX, oY);
  //draw.player(oX, oY);
  draw.entities(oX, oY);
  panel.update();
}

const draw = {
  clearAll: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  },
  grid: function () {
    const pH = c.CAM_DELTA_X; // padding vertical
    const pV = c.CAM_DELTA_Y; // padding horizontal
    for (var x = pH; x <= canvas.width - pH; x += c.PPP) {
      ctx.moveTo(x, pV);
      ctx.lineTo(x, canvas.height - pV);
    }
    for (var y = pV; y <= canvas.height - pV; y += c.PPP) {
      ctx.moveTo(pH, y);
      ctx.lineTo(canvas.width - pH, y);
    }

    ctx.strokeStyle = "#27292d";
    //ctx.strokeStyle = "#fff";
    ctx.stroke();
  },
  map: function (oX, oY) {
    for (let x = 0; x < t.view.length; x++) {
      for (let y = 0; y < t.view[0].length; y++) {
        const tile = t.view[x][y];
        //console.log(x, y, tile);
        const char = aux.mapSymbol(tile.terrain);
        let color;
        if (tile.visible) {
          color = aux.colorOfEntity("visible");
        } else if (tile.explored) {
          color = aux.colorOfEntity("explored");
        }
        if (color) {
          this.tile(x + oX, y + oY, char, color);
        }
      }
    }
  },
  tile: function (x, y, char, color) {
    ctx.fillStyle = color;
    ctx.fillText(char, (x * c.PPP) + (c.PPP / 2) + pH, (y * c.PPP) + pV);
  },
  clearTile: function (x, y) {
    ctx.clearRect(x * c.PPP, y * c.PPP + pV, c.PPP, c.PPP);
    ctx.beginPath();
  },
  player: function (oX, oY) {
    const x = t.pj.view.x + oX; //- t.cam.x;
    const y = t.pj.view.y + oY; //- t.cam.y;
    this.clearTile(x, y);
    ctx.fillStyle = "orange";
    ctx.fillText(/*"pj"*/aux.mapSymbol("player"), (x * c.PPP) + (c.PPP / 2) + pH, (y * c.PPP) + pV);
  },
  entities: function (oX, oY) {
    for (let e of t.entities) {
      //console.log(JSON.stringify(e, null, " "));
      const x = e.view.x + oX;
      const y = e.view.y + oY;
      const char = aux.mapSymbol(e.type);
      const color = aux.colorOfEntity(e.type);
      this.clearTile(x, y);
      this.tile(x, y, char, color);
    }
  }
};

const aux = {
  mapSymbol: function (symbol) {
    if (symbol.slice(0, 9) === "corpse of") {
      return String.fromCharCode(legend.get(symbol.slice(0, 9)));
    }
    return String.fromCharCode(legend.get(symbol));
  },
  colorOfEntity: function (entity) {
    if (entity.slice(0, 9) === "corpse of") {
      return colors.get(entity.slice(10, entity.length));
    }
    return colors.get(entity);
  },
};

const legend = new Map([
  ["floor", 183],   // middleDot 183 or normal point 46
  ["wall", 35],     // #35
  ["-", 0],
  ["player", 64],   // @64
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

export {
  ascii,
};
