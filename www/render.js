/* */
'use strict';

const gridValue = [".", "@"];

function drawGrid(data) {
  // manually set player pos
  data.grid[data.x][data.y] = 1;
  const cols = data.cols;
  const rows = data.rows;
  const board = document.createElement("board");
  board.id = "gameZone";

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

function redrawGrid(data) {
  document.getElementById("gameZone").remove();
  drawGrid(data);
}

function drawUI(data) {
  const player = document.createElement("nick");
  const nickText = document.createTextNode(data.nick);
  player.appendChild(nickText);
  document.getElementById("play").appendChild(player);
  document.getElementById("play").appendChild(document.createElement("br"));

}

export {
  drawGrid,
  drawUI,
  redrawGrid
};
