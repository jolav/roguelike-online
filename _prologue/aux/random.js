/* */

console.log('Loading..... aux/random.js');

const myRandom = {
  init: function (seed) {
    this.random = mulberry32(seed);
  },
  int: function (min, max) {
    return Math.floor(this.random() * (max - min + 1) + min);
  }
};

export {
  myRandom
};

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
