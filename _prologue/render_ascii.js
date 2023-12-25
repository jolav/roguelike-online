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
ctx.font = C.PPP + "px " + C.FONT;

function ascii() {
  draw.clearAll();
  draw.grid();
  //draw.player();
  //animation.player();
  draw.playerAnimation();
}

const draw = {
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
  player: function () {
    const x = t.pj.pos.x;
    const y = t.pj.pos.y;
    ctx.fillStyle = "orange";
    ctx.fillText("@", (x * C.PPP) + (C.PPP / 2) + pH, (y * C.PPP) + pV);
  },
  clearAll: function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  },
  playerAnimation: async function () {
    const x = t.pj.last.x;
    const y = t.pj.last.y;
    const dx = t.pj.pos.x - t.pj.last.x;
    const dy = t.pj.pos.y - t.pj.last.y;
    for (let i = 1; i <= C.PPP; i += C.ANIMATION_SPEED) {
      draw.clearAll();
      draw.grid();
      ctx.fillStyle = "orange";
      ctx.fillText(
        "@",
        (x * C.PPP) + (C.PPP / 2) + pH + i * dx,
        (y * C.PPP) + pV + i * dy
      );
      await lib.sleep(1000 / C.FPS);
    }

  }
};

const animation = {
  continueAnimation: true,
  player: function () {
    if (animation.continueAnimation) {
      setTimeout(function () {
        requestAnimationFrame(animation.player);
        // Drawing code 
        draw.clearAll();
        draw.grid();
        draw.playerA();
      }, 1000 / C.FPS);
    }
  },
};

export {
  ascii,
};
