/* */
'use strict';

const gridValue = [".", "#", "@"];

function drawGrid(a) {
  //manually set player pos
  //const pj = a.entities["player"];
  //a.view[11/*pj.x*/][11/*pj.y*/] = 2;
  const dimensions = [a.view.length, a.view[0].length];
  const cols = dimensions[0];
  const rows = dimensions[1];
  const board = document.createElement("board");
  board.id = "gameZone";

  for (var row = 0; row < rows; row++) {
    var column = document.createElement("tr");

    for (var col = 0; col < cols; col++) {
      var cell = document.createElement("td");
      var cellText = document.createTextNode(gridValue[a.view[col][row]]);
      cell.appendChild(cellText);
      column.appendChild(cell);
    }
    board.appendChild(column);
  }
  document.getElementById('play').appendChild(board);
}

function eraseGrid() {
  document.getElementById("gameZone").remove();
}

function drawUI(a) {
  const ui = document.createElement("ui");
  ui.id = "uiZone";
  const nickText = document.createTextNode("\"" + a.nick + "\" = ");
  const posText = document.createTextNode(a.entities["player"].x + ":" + a.entities["player"].y);
  ui.appendChild(nickText);
  ui.append(posText);
  document.getElementById("play").appendChild(ui);
  ui.appendChild(document.createElement("br"));
  document.getElementById("play").appendChild(document.createElement("br"));
}

function eraseUI() {
  const erase = document.getElementsByTagName("br");
  document.getElementsByTagName("br")[1].remove();
  if (erase.length === 2) {
    document.getElementsByTagName("br")[0].remove();
  }
  document.getElementById("uiZone").remove();
}

export {
  drawGrid,
  drawUI,
  eraseGrid,
  eraseUI,
};
