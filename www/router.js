/* */
"use strict";

import { conf, a, updateA } from "./_config.js";
import * as http from "./http.js";
import { actionKey, lostGame } from "./controls.js";
import * as render from "./render.js";
import * as util from "./utils.js";

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
  const aux = await http.fetchNewTurn(action);
  updateA(aux);
  showSomething();
  //util.showTiles();
  if (a.gameOver) {
    console.log('OIGAA');
    lostGame();
  }
  render.draw();
}

async function startNewGame() {
  let aux = await http.fetchNewGame();
  updateA(aux);
  showSomething();
  //util.showTiles();
  playGame();
  render.draw();
}

function showSomething() {
  //console.log(a.entities[0].combat);
  console.log('************ NEW TURN ', a.turn, '**********', a.gameOver);
}

export {
  landingPage,
};

