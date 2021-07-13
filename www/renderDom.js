/* */
'use strict';

function drawGrid(a) {
  const dimensions = [a.view.length, a.view[0].length];
  const cols = dimensions[0];
  const rows = dimensions[1];
  const visited = initializeMultiArray(cols, rows, false);
  const board = document.createElement("board");
  board.id = "boardZone";

  for (let row = 0; row < rows; row++) {
    const column = document.createElement("tr");
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("td");
      cell.id = col + "-" + row;
      const len = (a.legend[a.view[col][row]]).length;
      let legend = a.legend[a.view[col][row]];
      if (len > 1) {
        legend = legend.slice(1);
        visited[row][col] = true;
      }
      const cellText = document.createTextNode(legend);
      cell.appendChild(cellText);
      column.appendChild(cell);
    }
    board.appendChild(column);
  }
  document.getElementById('play').appendChild(board);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (visited[col][row]) {
        const id = row + "-" + col;
        document.getElementById(id).classList.add("visited");
      }
    }
  }
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

function initializeMultiArray(cols, rows, value) {
  let array = [];
  for (let i = 0; i < cols; i++) {
    array[i] = [];
    for (let j = 0; j < rows; j++) {
      array[i][j] = value;
    }
  }
  return array;
}
