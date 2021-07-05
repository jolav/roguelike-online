/* */
"use strict";

import { conf } from "./_config.js";
import { makeAsyncRequest } from "./lib.js";

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
  drawUI(data);
  drawGrid(data);
}

function drawUI(data) {
  const player = document.createElement("nick");
  const nickText = document.createTextNode(data.nick);
  player.appendChild(nickText);
  document.getElementById("play").appendChild(player);
  document.getElementById("play").appendChild(document.createElement("br"));

}

const gridValue = [".", "@"];

function drawGrid(data) {
  // manually set player pos
  data.grid[data.x][data.y] = 1;
  const cols = data.cols;
  const rows = data.rows;
  const board = document.createElement("board");

  for (var row = 0; row < rows; row++) {
    var column = document.createElement("tr");

    for (var col = 0; col < cols; col++) {
      var cell = document.createElement("td");
      var cellText = document.createTextNode(gridValue[data.grid[col][row]]);
      cell.appendChild(cellText);
      column.appendChild(cell);
    }

    board.appendChild(column);
  }
  document.getElementById('play').appendChild(board);
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
    data = await makeAsyncRequest(conf.apiUrlBase + "/new", 'GET', null);
  } catch (err) {
    console.error("ERROR FETCHING NEW GAME => ", err);
  }
  console.log(data);
  playGame(data);
}

export {
  landingPage,
};

