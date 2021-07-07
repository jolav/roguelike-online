/* */
"use strict";

import { conf, a } from "./_config.js";
import * as http from "./http.js";
import * as render from "./render.js";
import * as router from "./router.js";
import { actionKey } from "./controls.js";

function landingPage() {
  document.getElementById("intro").style.display = "block";
  document.getElementById("confirm").style.display = "none";
  document.getElementById("play").style.display = "none"; document.getElementById("newGame").addEventListener("click", startNewGame);
  if (conf.mode === "dev") {
    startNewGame();
  }
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
  window.addEventListener('keydown', function (e) {
    const action = actionKey(e);
    startNewTurn(action);
  });
}

async function startNewGame() {
  let data = await http.fetchNewGame();
  a.updateGameData(data);
  router.playGame(a);
}

async function startNewTurn(action) {
  let data = await http.fetchNewTurn(action);
  render.eraseGrid();
  render.drawGrid(data);
}

export {
  landingPage,
  playGame,
  startNewTurn,
};

