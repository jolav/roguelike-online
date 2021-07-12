/* */
'use strict';

function drawGrid(a) {
  const dimensions = [a.view.length, a.view[0].length];
  const cols = dimensions[0];
  const rows = dimensions[1];
  const board = document.createElement("board");
  board.id = "boardZone";

  for (var row = 0; row < rows; row++) {
    const column = document.createElement("tr");

    for (var col = 0; col < cols; col++) {
      const cell = document.createElement("td");
      cell.id = col + "-" + row;
      const cellText = document.createTextNode(a.legend[a.view[col][row]]);
      cell.appendChild(cellText);
      column.appendChild(cell);
    }
    board.appendChild(column);
  }
  document.getElementById('play').appendChild(board);
}

function eraseGrid() {
  document.getElementById("boardZone").remove();
}

function drawUI(a) {
  const ui = document.createElement("ui");
  ui.id = "uiZone";
  const playerX = a.entities["player"].x;
  const playerY = a.entities["player"].y;
  const nickText = document.createTextNode("\"" + a.nick + "\" = ");
  const posText = document.createTextNode(playerX + ":" + playerY);
  ui.appendChild(nickText);
  ui.appendChild(posText);
  ui.appendChild(document.createElement("br"));
  ui.appendChild(document.createElement("br"));
  document.getElementById("play").appendChild(ui);
}

function eraseUI() {
  document.getElementById("uiZone").remove();
}

export {
  drawGrid,
  drawUI,
  eraseGrid,
  eraseUI,
};
