/* */

console.log('Loading.....render_ascii.js');

import { C, lib } from "./_config.js";
import { t } from "./ask.js";

const canvas = document.getElementById(C.CANVAS_NAME);
canvas.width = (C.CAM_COLS * C.PPP) + (2 * C.CAM_DELTA_X);
canvas.height = (C.CAM_ROWS * C.PPP) + (2 * C.CAM_DELTA_Y);
const pH = C.CAM_DELTA_X;
const pV = C.CAM_DELTA_Y;
const ctx = canvas.getContext("2d");
ctx.textBaseline = "top";
ctx.textAlign = "center";
ctx.font = C.PPP + "px " + C.FONT[1];

function ascii() {
  draw.clearAll();
  draw.grid();
  draw.map();
  draw.items();
  draw.npcs();
  draw.player();
  if (C.INDEX_SELECTED !== undefined) {
    draw.tileSelected();
  }
  //draw.playerAnimation();
}

const draw = {
  map: function () {
    for (let x = 0; x < t.view.length; x++) {
      for (let y = 0; y < t.view[0].length; y++) {
        const tile = t.view[x][y];
        const char = aux.mapSymbol(tile.terrain);
        let color;
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
    ctx.fillText(char, (x * C.PPP) + (C.PPP / 2) + pH, (y * C.PPP) + pV);
  },
  tileSelected: function (x, y) {
    x = C.NPC_SELECTED.pos.x;
    y = C.NPC_SELECTED.pos.y;
    ctx.strokeStyle = "lightgreen";
    ctx.strokeRect(
      (x - t.cam.x) * C.PPP + pH,
      (y - t.cam.y) * C.PPP + pV,
      C.PPP,
      C.PPP
    );
  },
  clearTile: function (x, y) {
    ctx.clearRect(x * C.PPP, y * C.PPP + pV, C.PPP, C.PPP);
    ctx.beginPath();
  },
  grid: function () {
    const pH = C.CAM_DELTA_X; // padding vertical
    const pV = C.CAM_DELTA_Y; // padding horizontal
    for (var x = pH; x <= canvas.width - pH; x += C.PPP) {
      ctx.moveTo(x, pV);
      ctx.lineTo(x, canvas.height - pV);
    }
    for (var y = pV; y <= canvas.height - pV; y += C.PPP) {
      ctx.moveTo(pH, y);
      ctx.lineTo(canvas.width - pH, y);
    }

    ctx.strokeStyle = "#27292d";
    //ctx.strokeStyle = "#fff";
    ctx.stroke();
  },
  clearAll: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  },
  items: function () {
    for (let item of t.items) {
      const x = item.pos.x - t.cam.x;
      const y = item.pos.y - t.cam.y;
      let char = aux.mapSymbol("item");
      let color = aux.colorOfEntity("item");
      if (item.type === "exit") {
        char = aux.mapSymbol(item.type);
        color = aux.colorOfEntity(item.type);
      }
      this.clearTile(x, y);
      this.tile(x, y, char, color);
    }
  },
  npcs: function () {
    for (let npc of t.npcs) {
      const x = npc.pos.x - t.cam.x;
      const y = npc.pos.y - t.cam.y;
      const char = aux.mapSymbol(npc.type);
      const color = aux.colorOfEntity(npc.type);
      this.clearTile(x, y);
      this.tile(x, y, char, color);
    }
  },
  player: function () {
    const x = t.pj.pos.x - t.cam.x;
    const y = t.pj.pos.y - t.cam.y;
    this.clearTile(x, y);
    ctx.fillStyle = "orange";
    ctx.fillText("@", (x * C.PPP) + (C.PPP / 2) + pH, (y * C.PPP) + pV);
  },
  playerAnimation: async function () {
    const x = t.pj.last.x;
    const y = t.pj.last.y;
    const dx = t.pj.pos.x - t.pj.last.x;
    const dy = t.pj.pos.y - t.pj.last.y;
    for (let i = 1; i <= C.PPP; i += C.ANIMATION_SPEED) {
      draw.clearAll();
      draw.grid();
      draw.map();
      ctx.fillStyle = "orange";
      ctx.fillText(
        "@",
        (x * C.PPP) + (C.PPP / 2) + pH + i * dx,
        (y * C.PPP) + pV + i * dy
      );
      await lib.sleep(1000 / C.FPS);
    }
    this.clearTile(x + dx, y + dy);
    this.player(x + dx, y + dy);
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

export {
  ascii,
};
