/* */

console.log('Loading..... client/game.js');

const g = {
  info: {
    NICK: "",
    ID: "",
    SEED: 0,
  },
  turn: 0,
  is_server_turn: true,// false,
  map: [],
  create: function name(aux) {
    g.info.ID = aux.ID;
    g.info.SEED = aux.SEED;
    g.map = aux.map;
    g.entities = aux.entities;
    //g.pj = aux.PJ.Current;
    g.turn = 0;
  },
  update: function (turn) {
    g.turn = turn.turn;
    g.map = turn.map;
  },
};

export {
  g
};
