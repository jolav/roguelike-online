/* */

console.log('Loading..... client/game.js');

const g = {
  info: {
    NICK: "",
    ID: "",
    SEED: 0,
  },
  turn: 0,
  lastTurn: Date.now(),
  is_server_turn: false,
  map: [],
  entities: [],
};

const game = {
  create: function name(aux) {
    g.info.ID = aux.ID;
    g.info.SEED = aux.SEED;
    g.map = aux.map;
    g.entities = aux.entities;
    g.turn = 0;
  },
  update: function (turn) {
    g.turn = turn.turn;
    g.map = turn.map;
    g.entities = turn.entities;
  },
};

export {
  g,
  game,
};
