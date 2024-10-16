/* */

const config = {
  MODE: "production",
  NICK: "n",
  VERSION: "x",
  LAG: 0,
  API: {
    used: 1,// 0 real API, 1 local dev API
    url: [
      "https://m.d100.top/p",
      "http://localhost:3000"
    ],
    version: "/version/v1",
    ping: "/ping"
  },
  NICK_API: "https://m.d100.top/a/random/name",
  PINGER_DELAY: 500,
};

export {
  config,
};