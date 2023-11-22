/* */

console.log('Loading.....render.js');

import { K } from "./_config.js";
import { g, pj } from "./game.js";

const canvas = document.getElementById(K.CANVAS_NAME);
canvas.width = K.WIDTH;
canvas.height = K.HEIGHT;
const cols = K.WIDTH / K.PPP;
const rows = K.HEIGHT / K.PPP;
const textOffset = K.PPP / 16;
const ctx = canvas.getContext('2d');
const fontType = "PressStart2P";
const font = K.PPP + "px " + fontType;
ctx.font = font;

function player() {
  ctx.fillStyle = "#fff";
  ctx.fillText("@", pj.x * K.PPP, pj.y * K.PPP);
}

function draw() {
  clearAll();
  setTime();
  player();
}

function clearAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
}

function setTime() {
  let aa = g.currentDate.toDateString().slice(4);
  let bb = g.currentDate.toTimeString().split(" ")[0];
  document.getElementById("date").innerHTML = aa;
  document.getElementById("time").innerHTML = bb;
}

export {
  draw
};
