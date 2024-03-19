/* */

console.log('Loading.....render_ascii.js');

import { c } from "./_config.js";
import * as panel from "./panel.js";
import { t } from "./http.js";

const canvas = document.getElementById(c.CANVAS_NAME);
canvas.width = (c.CAM_COLS * c.PPP) + (2 * c.CAM_DELTA_X);
canvas.height = (c.CAM_ROWS * c.PPP) + (2 * c.CAM_DELTA_Y);
const pH = c.CAM_DELTA_X;
const pV = c.CAM_DELTA_Y;
let offsetX = 0; //center map if smaller than cam
let offsetY = 0;
const ctx = canvas.getContext("2d");
ctx.textBaseline = "top";
ctx.textAlign = "center";
ctx.font = c.PPP + "px " + c.FONT[1];

function ascii() {
  draw.clearAll();
  draw.grid();
  draw.view();
  draw.entities();
  draw.player();
  panel.update();
}

const draw = {
  view: function () {
    offsetX = Math.floor((c.CAM_COLS - c.VIEW_COLS) / 2);
    offsetY = Math.floor((c.CAM_ROWS - c.VIEW_ROWS) / 2);
    for (let y = 0; y < c.VIEW_ROWS; y++) {
      for (let x = 0; x < c.VIEW_COLS; x++) {
        const tile = t.view[y][x];
        const char = aux.mapSymbol(tile.terrain);
        let color; //= "#fff";
        if (tile.visible) {
          color = aux.colorOfEntity("visible");
        } else if (tile.explored) {
          color = aux.colorOfEntity("explored");
        }
        if (color) {
          this.tile(x, y, char, color);
        }
      }
    }
  },
  tile: function (x, y, char, color) {
    ctx.fillStyle = color;
    ctx.fillText(
      char,
      (x + offsetX) * c.PPP + (c.PPP / 2) + pH,
      (y + offsetY) * c.PPP + pV
    );
  },
  clearAll: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  },
  clearTile: function (x, y) {
    ctx.clearRect(
      (x + offsetX) * c.PPP,
      (y + offsetY) * c.PPP + pV,
      c.PPP,
      c.PPP
    );
    ctx.beginPath();
  },
  player: function () {
    const x = t.pj.pos.view.x;
    const y = t.pj.pos.view.y;
    this.clearTile(x, y);
    ctx.fillStyle = "orange";
    ctx.fillText(aux.mapSymbol("player"),
      ((x + offsetX) * c.PPP) + (c.PPP / 2) + pH,
      ((y + offsetY) * c.PPP) + pV);//,
    //c.PPP); // Fourth Argument max width to render the string.
  },
  entities: function () {
    for (let i = 0; i < t.entities.length; i++) {
      const x = t.entities[i].pos.view.x;
      const y = t.entities[i].pos.view.y;
      this.clearTile(x, y);
      ctx.fillStyle = aux.colorOfEntity(t.entities[i].kind);
      ctx.fillText(
        aux.mapSymbol(t.entities[i].kind),
        ((x + offsetX) * c.PPP) + (c.PPP / 2) + pH,
        ((y + offsetY) * c.PPP) + pV);//,
    }
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
    ctx.strokeStyle = "#323535";

    ctx.stroke();
  },

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
  ["explored", "#464a4a"],
  ["rat", "DeepPink"],
  ["mole rat", "DeepPink"],
  ["item", "orange"],
  ["exit", "yellow"],
]);

export {
  ascii
};
