/* */

console.log('Loading..... render_ascii.js');

import { c } from "./_config.js";
import { t } from "./ask.js";
import * as panel from "./panel.js";

const canvas = document.getElementById(c.CANVAS_NAME);
canvas.width = c.VIEW_COLS * c.PPP_X;
canvas.height = c.VIEW_ROWS * c.PPP_Y;
const ctx = canvas.getContext("2d");
ctx.font = c.PPP_X + "px " + c.FONTS[c.FONT_SELECTED];
ctx.textBaseline = "middle"; //"top";
ctx.textAlign = "center";

function ascii() {
  const oX = Math.floor((c.VIEW_COLS - t.view.length) / 2);
  const oY = Math.floor((c.VIEW_ROWS - t.view[0].length) / 2);
  draw.clearAll();
  draw.map(oX, oY);
  //draw.grid();
  //draw.info();
  //draw.player(oX,oY,e);
  draw.entities(oX, oY, t.entities);
  panel.update();
}

const draw = {
  clearAll: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  },
  map: function (oX, oY) {
    //console.log(t.view.length, t.view[0].length);
    //console.log(c.VIEW_COLS, c.VIEW_ROWS);
    for (let x = 0; x < t.view.length; x++) {
      for (let y = 0; y < t.view[0].length; y++) {
        const tile = t.view[x][y];
        if (tile === undefined) {
          console.log('PROBLEM');
          continue;
        }
        const char = aux.mapSymbol(tile.terrain);
        let color;
        //if (tile.visible) {
        color = aux.colorOfEntity("visible");
        /*} else if (tile.explored) {
          color = aux.colorOfEntity("explored");
        }*/
        if (color) {
          this.tile(x + oX, y + oY, char, color);
        }
      }
    }
  },
  tile: function (x, y, char, color) {
    ctx.fillStyle = dawnBringer.get(color);
    ctx.fillText(
      char,
      (x * c.PPP_X) + (c.PPP_X / 2),
      (y * c.PPP_Y) + (c.PPP_Y / 2),
      //c.PPP_X); // Fourth Argument max width to render the string.
    );
  },
  grid: function () {
    for (var x = 0; x < canvas.width; x += c.PPP_X) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (var y = 0; y < canvas.height; y += c.PPP_Y) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.strokeStyle = "#323535";
    ctx.stroke();
  },
  info: function () {
    ctx.fillStyle = "lightcoral";
    ctx.font = "bold 1em " + c.FONTS[c.FONT_SELECTED];
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(c.NICK, c.PPP_X, c.PPP_Y);
    ctx.textAlign = "right";
    let text = "v." + c.VERSION + "   ";
    text += "ping_" + c.LAG + "(process_" + c.TPT + ")";
    ctx.fillText(text, canvas.width - c.PPP_X, c.PPP_Y);
    // recover default values 
    ctx.textBaseline = "middle"; //"top";
    ctx.textAlign = "center";
  },
  clearTile: function (x, y) {
    ctx.clearRect(x * c.PPP_X, y * c.PPP_Y, c.PPP_X, c.PPP_Y);
    ctx.beginPath();
  },
  player: function (oX, oY, e) {
    const x = e.view.x + oX;
    const y = e.view.y + oY;
    this.clearTile(x, y);
    ctx.font = c.PPP_X + "px " + c.FONTS[c.FONT_SELECTED];
    ctx.fillStyle = "darkorange";
    ctx.fillText(aux.mapSymbol("player"),//"@",
      (x * c.PPP_X) + (c.PPP_X / 2),
      (y * c.PPP_Y) + (c.PPP_Y / 2),
      //c.PPP_X); // Fourth Argument max width to render the string.
    );
  },
  entities: function (oX, oY, es) {
    let playerEntity = undefined;
    for (let e of es) {
      if (e.components.player) {
        playerEntity = e;
      }
      //console.log(JSON.stringify(e, null, " "));
      const x = e.view.x + oX;
      const y = e.view.y + oY;
      const char = aux.mapSymbol(e.components.tags.type);
      const color = aux.colorOfEntity(e.components.tags.type);
      this.clearTile(x, y);
      this.tile(x, y, char, color);
    }
    this.player(oX, oY, playerEntity);
  }
};

export {
  ascii,
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

