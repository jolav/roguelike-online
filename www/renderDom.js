/* */
'use strict';

function drawGrid(a) {
  const dimensions = [a.view.length, a.view[0].length];
  const cols = dimensions[0];
  const rows = dimensions[1];
  const visited = initializeMultiArray(cols, rows, false);
  const board = document.createElement("board");
  board.id = "boardZone";
  // draw tilemaps
  for (let row = 0; row < rows; row++) {
    const column = document.createElement("tr");
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("td");
      cell.id = col + "-" + row;
      const len = (a.legend[a.view[col][row]]).length;
      let legend = a.legend[a.view[col][row]];
      if (len > 1) {
        legend = legend.slice(1);
        visited[col][row] = true;
      }
      const cellText = document.createTextNode(legend);
      cell.appendChild(cellText);
      column.appendChild(cell);
    }
    board.appendChild(column);
  }
  document.getElementById('play').appendChild(board);
  // draw entities
  for (let e in a.entities) {
    const posX = a.entities[e].pos.x;
    const posY = a.entities[e].pos.y;
    const legend = a.entities[e].pos.char;
    const cell = document.getElementById(posX + "-" + posY);
    if (cell === null) console.log(posX + "-" + posY);
    cell.innerText = legend;
  }
  // draw player again ensure is on the top
  const posX = a.entities[0].pos.x;
  const posY = a.entities[0].pos.y;
  const legend = a.entities[0].pos.char;
  const cell = document.getElementById(posX + "-" + posY);
  cell.innerText = legend;
  // draw visited
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (visited[col][row]) {
        const id = col + "-" + row;
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
  const player = a.entities[0];
  const nickText = document.createTextNode("\"" + a.nick + "\" ");
  const hp = "HP: " + player.combat.hp + "/" + player.combat.maxhp;
  const hpText = document.createTextNode(hp);
  const messages = document.createElement("textarea");
  messages.id = "msgZone";
  messages.setAttribute("cols", 70);
  messages.setAttribute("rows", 5);
  //messages.setAttribute("value", a.history);
  ui.appendChild(nickText);
  ui.appendChild(hpText);
  ui.appendChild(document.createElement("br"));
  ui.appendChild(document.createElement("br"));
  ui.appendChild(messages);
  ui.appendChild(document.createElement("br"));
  ui.appendChild(document.createElement("br"));
  document.getElementById("play").appendChild(ui);
  document.getElementById("msgZone").value = a.history;

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

