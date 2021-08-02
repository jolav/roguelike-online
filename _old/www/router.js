/* */
"use strict";

import { conf, a } from "./_config.js";
import * as http from "./http.js";
import * as render from "./renderDom.js";
import * as router from "./router.js";
import { actionKey, looseGame } from "./controls.js";

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

function playGame(a) {
  document.getElementById("intro").style.display = "none";
  document.getElementById("confirm").style.display = "none";
  document.getElementById("play").style.display = "block";
  render.drawUI(a);
  render.drawGrid(a);
  window.addEventListener('keydown', function (e) {
    const action = actionKey(e);
    startNewTurn(action);
  });
}

async function startNewGame() {
  let aux = await http.fetchNewGame();
  a.updateNewGameData(aux);
  console.log(a.gameOver);
  router.playGame(a);
}

async function startNewTurn(action) {
  let data = await http.fetchNewTurn(action);
  if (data.gameOver) {
    looseGame();
  }
  console.log(data);
  data.history.reverse();
  let aux = "";
  for (let i = 0; i < data.history.length; i++) {
    aux += data.history[i] + " \n";
  }
  data.history = aux;
  render.eraseUI();
  render.drawUI(data);
  render.eraseGrid();
  render.drawGrid(data);
}

export {
  landingPage,
  playGame,
  startNewTurn,
};

