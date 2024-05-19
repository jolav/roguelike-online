/* */

console.log('Loading..... render_ascii.js');

import { t } from "./http.js";
import { c } from "./_config.js";

const canvas = document.getElementById(c.CANVAS_NAME);
canvas.width = c.VIEW_COLS * c.PPP;
canvas.height = c.VIEW_ROWS * c.PPP;
const ctx = canvas.getContext("2d");
ctx.font = c.PPP + "px " + c.FONTS[c.FONT_SELECTED];
console.log(ctx.font);
ctx.textBaseline = "middle"; //"top";
ctx.textAlign = "center";

function ascii() {
  draw.clearAll();
  draw.grid();
  draw.info();
  draw.player();
}

const draw = {
  clearAll: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  },
  grid: function () {
    for (var x = 0; x < canvas.width; x += c.PPP) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (var y = 0; y < canvas.height; y += c.PPP) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.strokeStyle = "#323535";
    ctx.stroke();
  },
  info: function () {
    ctx.fillStyle = "darkolivegreen";
    ctx.font = "bold 1em " + c.FONTS[c.FONT_SELECTED];
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(t.nick, c.PPP, c.PPP);
    ctx.textAlign = "right";
    const text = "v." + c.VERSION + "     ping_" + t.lag;
    ctx.fillText(text, canvas.width - c.PPP, c.PPP);
    // recover default values 
    ctx.textBaseline = "middle"; //"top";
    ctx.textAlign = "center";
  },
  player: function () {
    ctx.font = c.PPP + "px " + c.FONTS[c.FONT_SELECTED];
    ctx.fillStyle = "darkorange";
    ctx.fillText("@",
      (Math.floor(c.VIEW_COLS / 2) * c.PPP) + (c.PPP / 2),
      (Math.floor(c.VIEW_ROWS / 2) * c.PPP) + (c.PPP / 2)
      //c.PPP); // Fourth Argument max width to render the string.
    );
  },
};

export {
  ascii
};
