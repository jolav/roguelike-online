/* */

console.log('Loading.....render_ascii.js');

import { c } from "./_config.js";
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
ctx.font = c.PPP + "px " + c.FONT[c.FONT_SELECTED];

function ascii() {
  const oX = Math.floor((c.CAM_COLS - t.view.length) / 2);
  const oY = Math.floor((c.CAM_ROWS - t.view[0].length) / 2);
  const pj = t.entities[0];
  let dead = [];
  let active = [];
  [dead, active] = aux.separateEntities(t.entities);
  draw.clearAll();
  //draw.grid();
  draw.map(oX, oY);
  draw.entities(oX, oY, dead);
  draw.items(oX, oY);
  draw.entities(oX, oY, active);
  draw.player(oX, oY, pj);
  if (c.INDEX_SELECTED !== undefined) {
    draw.tileSelected();
  }
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

    ctx.strokeStyle = dawnBringer.get(colors.get("grid"));
    ctx.stroke();
  },
  map: function (oX, oY) {
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
          this.tile(x + oX, y + oY, char, color);
        }
      }
    }
  },
  tile: function (x, y, char, color) {
    ctx.fillStyle = dawnBringer.get(color);
    ctx.fillText(char, (x * c.PPP) + (c.PPP / 2) + pH, (y * c.PPP) + pV, c.PPP);
  },
  clearTile: function (x, y) {
    ctx.clearRect(x * c.PPP, y * c.PPP + pV, c.PPP, c.PPP);
    ctx.beginPath();
  },
  tileSelected: function (x, y) {
    x = c.NPC_SELECTED.pos.x;
    y = c.NPC_SELECTED.pos.y;
    ctx.strokeStyle = dawnBringer.get(colors.get("tileSelected"));
    ctx.strokeRect(
      (x - t.cam.x) * c.PPP + pH,
      (y - t.cam.y) * c.PPP + pV,
      c.PPP,
      c.PPP
    );
  },
  player: function (oX, oY, pj) {
    const x = pj.view.x + oX;
    const y = pj.view.y + oY;
    this.clearTile(x, y);
    ctx.fillStyle = dawnBringer.get(colors.get("player"));
    ctx.fillText(/*"pj"*/aux.mapSymbol("player"), (x * c.PPP) + (c.PPP / 2) + pH, (y * c.PPP) + pV);
    //c.PPP); // Fourth Argument max width to render the string.

  },
  items: function (oX, oY) {
    for (let item of t.items) {
      const x = item.view.x + oX;
      const y = item.view.y + oY;
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
  entities: function (oX, oY, es) {
    for (let e of es) {
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
    switch (c.RENDER_TYPE) {
      case 0:
        if (symbol.slice(0, 9) === "corpse of") {
          return String.fromCharCode(legend.get(symbol.slice(0, 9)));
        }
        return String.fromCharCode(legend.get(symbol));
      case 1:
        if (symbol.slice(0, 9) === "corpse of") {
          return unicode.get(symbol.slice(0, 9));
        }
        return unicode.get(symbol);
    }
  },
  colorOfEntity: function (entity) {
    if (entity.slice(0, 9) === "corpse of") {
      return colors.get(entity.slice(10, entity.length));
    }
    return colors.get(entity);
  },
  separateEntities: function (es) {
    let dead = [];
    let active = [];
    for (let e of es) {
      if (e.id === 0) {
        continue;
      }
      if (e.is.combatant) {
        active.push(e);
      } else {
        dead.push(e);
      }
    }
    return [dead, active];
  },
};

// https://en.wikipedia.org/wiki/Code_page_437  
// https://en.wikipedia.org/wiki/List_of_Unicode_characters
// https://russellcottrell.com/greek/utilities/SurrogatePairCalculator.htm

const unicode = new Map([
  ["floor", "\u00b7"],   // middleDot 
  ["wall", "\u25a0"],     // \u25a0 
  ["player", "\u0040"],   // @ \u0040
  ["mole rat", 'r6'],     // ra \u1f400 o \ud83d\ude00
  ["rat", "r1"], // Mr
  ["corpse of", "\u0025"],    // %
  ["item", "\u003f"],    // ?
  ["exit", "\u2302"], // <
]);

const unicodeGlyphs = new Map([
  ["floor", "\u00b7"],   // middleDot 
  ["wall", "\u25a0"],     // \u25a0 
  ["player", "\u0040"],   // @ \u0040
  ["mole rat", '\ud83d\udc00'],     // ra \u1f400 o \ud83d\ude00
  ["rat", "\ud83d\udc01"], // Mr
  ["corpse of", "\u0025"],    // %
  ["item", "\u003f"],    // ?
  ["exit", "\u2302"], // <
]);

const legend = new Map([
  ["floor", 183],   // middleDot 183 or normal point 46
  ["wall", 35],     // #35
  ["-", 0],
  ["player", 64],   // @64
  ["rat", 114],     // r 114
  ["mole rat", 82], // R 82
  ["corpse of", 37],    // %
  ["item", 63],    // ?
  ["exit", 60], // <
]);

const colors = new Map([
  ["player", "Tahiti Gold"],
  ["visible", "Light Steel Blue"],
  ["explored", "Smokey Ash"],
  ["rat", "Brown"],
  ["mole rat", "Brown"],
  ["item", "Pancho"],
  ["exit", "Golden Fizz"],
  ["grid", "grid"],
  ["tileSelected", "Tahiti Gold"],
]);

const dawnBringer = new Map([
  ["Black", "#000000"],
  ["Valhalla", "#222034"],
  ["Loulou", "#45283C"],
  ["Oiled Cedar", "#663931"],
  ["Rope", "#8F563B"],
  ["Tahiti Gold", "#DF7126"],
  ["Twine", "#D9A066"],
  ["Pancho", "#EEC39A"],
  ["Golden Fizz", "#FBF236"],
  ["Atlantis", "#99E550"],
  ["Christi", "#6ABE30"],
  ["Elf Green", "#37946E"],
  ["Dell", "#4B692F"],
  ["Verdigris", "#524B24"],
  ["Opal", "#323C39"],
  ["Deep Koamaru", "#3F3F74"],
  ["Venice Blue", "#306082"],
  ["Royal Blue", "#5B6EE1"],
  ["Cornflower", "#639BFF"],
  ["Viking", "#5FCDE4"],
  ["Light Steel Blue", "#CBDBFC"],
  ["White", "#FFFFFF"],
  ["Heather", "#9BADB7"],
  ["Topaz", "#847E87"],
  ["Dim Gray", "#696A6A"],
  ["Smokey Ash", "#595652"],
  ["Clairvoyant", "#76428A"],
  ["Brown", "#AC3232"],
  ["Mandy", "#D95763"],
  ["Plum", "#D77BBA"],
  ["Rainforest", "#8F974A"],
  ["Stinger", "#8A6F30"],
  ["grid", "#27292d"],
]);

export {
  ascii,
  dawnBringer,
};
