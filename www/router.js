/* */
"use strict";

import { conf, a } from "./_config.js";
import * as http from "./http.js";
import { actionKey } from "./controls.js";

function landingPage() {
  document.getElementById("intro").style.display = "block";
  document.getElementById("confirm").style.display = "none";
  document.getElementById("play").style.display = "none"; document.getElementById("newGame").addEventListener("click", startNewGame);
  if (conf.mode === "dev") { // auto start in dev mode
    startNewGame();
  }
}

function confirmForm() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("confirm").style.display = "block";
  document.getElementById("play").style.display = "none";
}

function playGame() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("confirm").style.display = "none";
  document.getElementById("play").style.display = "block";
  window.addEventListener('keydown', function (e) {
    const action = actionKey(e);
    startNewTurn(action);
  });
}

async function startNewTurn(action) {
  let aux = await http.fetchNewTurn(action);
  console.log(aux);
}

async function startNewGame() {
  let aux = await http.fetchNewGame();
  a.updateNewGameData(aux);
  console.log(a);
  playGame();
}

export {
  landingPage,
};
