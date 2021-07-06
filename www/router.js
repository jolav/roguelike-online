/* */
"use strict";

import { conf, game } from "./_config.js";
import { makeAsyncRequest } from "./lib.js";
import * as render from "./render.js";
import { actionKey } from "./controls.js";

function landingPage() {
  document.getElementById("intro").style.display = "block";
  document.getElementById("confirm").style.display = "none";
  document.getElementById("play").style.display = "none"; document.getElementById("newGame").addEventListener("click", newGame);
  newGame();
}

function confirmForm() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("confirm").style.display = "block";
  document.getElementById("play").style.display = "none";
}

function playGame(data) {
  document.getElementById("intro").style.display = "none";
  document.getElementById("confirm").style.display = "none";
  document.getElementById("play").style.display = "block";
  render.drawUI(data);
  render.drawGrid(data);
  window.addEventListener('keydown', actionKey);
}

async function newGame() {
  let data = {
    nick: "",
    token: "",
    cols: 0,
    rows: 0,
    grid: [],
    x: 0,
    y: 0

  };
  try {
    data = await makeAsyncRequest(conf.apiUrlBase + "/new", 'GEt', null);
  } catch (err) {
    console.error("ERROR FETCHING NEW GAME => ", err);
  }
  game.nick = data.nick;
  game.token = data.token;
  console.log(data);
  playGame(data);
}

export {
  landingPage,
};

