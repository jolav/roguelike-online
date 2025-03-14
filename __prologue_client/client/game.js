/* */

console.log('Loading..... client/game.js');

const g = {
  info: {
    nick: "",
    id: "",
    seed: 0,
  },
  turn: 0,
  lastTurn: Date.now(),
  is_server_turn: false,
  map: [],
  entities: new Map(),
  actions: [],
};

const game = {
  create: function name(aux) {
    g.info.id = aux.id;
    g.info.seed = aux.seed;
    g.map = aux.map;
    //g.entities = new Map(Object.entries(aux.entities));
    g.entities = new Map(
      Object.entries(aux.entities).map(function ([id, entity]) {
        return [parseInt(id), entity];
      })
    );
    //console.log(g.entities.get(2));
    g.turn = 0;
  },
  update: function (turn) {
    g.turn = turn.turn;
    g.map = turn.map;
    //g.entities = new Map(Object.entries(turn.entities));
    g.entities = new Map(
      Object.entries(turn.entities).map(function ([id, entity]) {
        return [parseInt(id), entity];
      })
    );
    //console.log(g.entities.get(2));
    g.actions = turn.actions;
  },
};

export {
  g,
  game,
};
