/* */

console.log('Loading....._config.js');

let C = {
  VERSION: 0
};

(function autoUpdateK() {
  //console.log('Autoupdate');
})();

const aux = {
  sleep: function (ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  },
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
};

export {
  C,
  aux,
};
