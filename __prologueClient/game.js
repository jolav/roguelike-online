/* */

console.log('Loading..... game.js');

const g = {
  info: {
    VERSION: "x",
    NICK: "",
    ID: "",
    SEED: 0,
  },
  lag: {
    network: 0,
    cpu: 0,
    render: 0,
  },
  turn: 0,
  is_server_turn: false,
  map: []
};

const game = {
};

export {
  g,
  game,
};
