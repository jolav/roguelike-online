/* */

console.log('Loading..... client/game.js');

const g = {
  info: {
    nick: "",
    id: "",
    seed: 0,
    tpt: 0,
    lag: 0,
  },
  turn: 0,
  lastTurn: Date.now(),
  is_server_turn: false,
  map: [],
  entities: new Map(),
  actions: [],
  history: [],
};

const game = {
  create: function name(aux) {
    g.info.id = aux.id;
    g.info.seed = aux.seed;
    g.info.tpt = aux.tpt;
    g.info.lag = -1;
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
    g.info.tpt = turn.tpt;
    g.info.lag = -1;
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
