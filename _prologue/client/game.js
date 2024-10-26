/* */

console.log('Loading..... game.js');

const g = {
  info: {
    NICK: "",
    ID: "",
    SEED: 0,
  },
  turn: 0,
  is_server_turn: false,
  map: [],
  entities: new Map()
};

export {
  g
};
