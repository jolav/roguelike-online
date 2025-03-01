/* */

console.log('Loading..... core/_konfig.js');

const K = {
  "mode": "prod",
  "TICK": 250,
  "TRIES": 5000,
};

(function autoUpdate() {
  const where = window.location.hostname;
  if (where === "localhost" || where === "127.0.0.1") {
    K.mode = "dev";
  }
})();

export {
  K
};
