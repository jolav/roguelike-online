/* */

console.log('Loading..... ./client/game.js');

const g = {
  info: {
    NICK: "",
    ID: "",
    SEED: 0,
  },
  turn: 0,
  is_server_turn: false,
  map: []
};

const game = {
  create: function name(run) {
    g.info.ID = run.id;
    g.info.SEED = run.seed;
    g.map = run.map;
    g.turn = 0;
    g.history = run.history;
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
    const data = this.compactHistory(turn.history);
    g.history = g.history.concat(data);
  },
};

export {
  g,
  game,
};
