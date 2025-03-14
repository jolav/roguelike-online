/* */

console.log('Loading..... client/render_ascii.js');

import { config as c } from "./_config.js";
import { g } from "./game.js";

const canvas = document.getElementById(c.CANVAS.NAME);
canvas.width = c.VIEW.COLS * c.VIEW.PPP_X;
canvas.height = c.VIEW.ROWS * c.VIEW.PPP_Y;
canvas.style.position = 'absolute';
canvas.style.left = c.VIEW.DELTA_X + "px";
canvas.style.top = c.VIEW.DELTA_Y + "px";
const ctx = canvas.getContext("2d");
ctx.font = c.VIEW.PPP_Y + "px " + c.CANVAS.FONTS[c.CANVAS.FONT_SELECTED];
ctx.textBaseline = "middle";//"middle"; //"top";
ctx.textAlign = "center";

ctx.fillText(' ', 0, 0); // force font loaded

async function ascii() {
  const start = performance.now();
  document.getElementById("panelVersion").innerHTML = "v" + c.VERSION;
  draw.clearAll();
  draw.grid();
  draw.map();
  draw.entities();
  await draw.actions();
  //draw.pj();
  const perf = performance.now() - start;
  console.log(`Time=>  LAG ${c.LAG}  Render ${perf} ms`);
}

const draw = {
  clearAll: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  },
  grid: function () {
    for (let x = 0; x < canvas.width; x += c.VIEW.PPP_X) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height - 0);
    }
    for (let y = 0; y < canvas.height; y += c.VIEW.PPP_Y) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width - 0, y);
    }
    ctx.strokeStyle = dawnBringer.get("grid"); //"#555555";//"#323535";
    ctx.stroke();
  },
  map: function () {
    //console.log(g.map.length, g.map[0].length);
    //console.log(c.VIEW.COLS, c.VIEW.ROWS);
    for (let col = 0; col < g.map.length; col++) {
      for (let row = 0; row < g.map[0].length; row++) {
        const terrain = g.map[col][row].terrain;
        //const color = aux.colorOfEntity("visible");
        switch (terrain) {
          case "wall":
            this.tile(col, row, aux.mapSymbol("wall"), /*color*/ "Heather");
            break;
          default:
            this.tile(col, row, aux.mapSymbol("floor"), /*color*/"Atlantis");
        }
      }
    }
  },
  entities: function (id) {
    //console.log('HOLA', g.entities.size);
    for (const [k, v] of g.entities) {
      if (k === id) {
        continue; //avoid drawing yourself while animating 
      }
      const type = v.info.Type;
      const color = aux.colorOfEntity(type);
      const x = v.pos.OnMap.X; //Current.X;
      const y = v.pos.OnMap.Y; //Current.Y;
      //this.tile(x, y, aux.mapSymbol(type), color);
      this.entity(x, y, type, color);
    }
  },
  entity: function (x, y, type, color) {
    //console.log(x, y);
    this.clearTile(x, y);
    this.tile(x, y, aux.mapSymbol(type), color);
  },
  tile: function (x, y, char, color) {
    ctx.fillStyle = dawnBringer.get(color);
    ctx.fillText(
      char,
      (x * c.VIEW.PPP_X) + (c.VIEW.PPP_X / 2),
      (y * c.VIEW.PPP_Y) + (c.VIEW.PPP_Y / 2),
      //c.VIEW.PPP_X // Fourth Argument max width to render the string.
    );
  },
  clearTile: function (x, y) {
    ctx.clearRect(
      x * c.VIEW.PPP_X, y * c.VIEW.PPP_Y,
      c.VIEW.PPP_X, c.VIEW.PPP_Y
    );
    ctx.beginPath();
  },
  actions: async function () {
    for (const a of g.actions) {
      const e = g.entities.get(/*String*/(a.ID));
      let start = e.pos.OnMap;
      const end = e.pos.Current;
      if (a.Type === "skip") {
        start = end;
      }
      await this.animate(e, start, end, c.RENDER.STEPS);
      e.pos.OnMap = end;
    }
  },
  animate: function (e, start, end, steps) {
    //console.log('animate-', e, start, end, steps);
    return new Promise(function (resolve) {
      let step = 0;
      function animateStep() {
        this.clearAll();
        this.grid();
        this.map();
        this.entities(/*String*/(e.eID));

        const currentX = start.X + (end.X - start.X) * (step / steps);
        const currentY = start.Y + (end.Y - start.Y) * (step / steps);
        //const char = aux.mapSymbol(e.info.Type);
        const color = aux.colorOfEntity(e.info.Type);
        this.entity(currentX, currentY, e.info.Type, color);

        step++;
        if (step <= steps) {
          requestAnimationFrame(animateStep.bind(this));
        } else {
          resolve();
        }
      }
      animateStep.call(this);
    }.bind(this));
  },
};

export {
  ascii,
};

const aux = {
  mapSymbol: function (symbol) {
    switch (c.RENDER.TYPE) {
      case 0:
        return String.fromCharCode(legend.get(symbol));
      case 1:
        return unicode.get(symbol);
      case 2:
        return unicodeGlyphs.get(symbol);
    }
  },
  colorOfEntity: function (entity) {
    return colors.get(entity);
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
  ["floor", 46],   // middleDot 183 or normal point 46
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
