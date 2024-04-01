/* */

const c = {
  VERSION: "0",
  LAG: 0,
  NETWORK: 1,  // 0 => simulate, 1 => Real
  // API
  API_BASE_URL: "https://p.roguelike.online",
  PING_ENDPOINT: "/ping2",
  TEST_ENDPOINT: "/test",
};

const lib = {
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
};

export {
  c,
  lib,
};
