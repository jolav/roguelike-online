/* */

console.log('Loading..... aux/random.js');

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

class Random {
  constructor(seed) {
    this.random = mulberry32(seed);
  }
  static create(seed) {
    if (!Random.instance) {
      Random.instance = new Random(seed);
    }
    return Random.instance;
  }
  static int(min, max) {
    //console.log('seed');
    return Math.floor(Random.instance.random() * (max - min + 1) + min);
  }
  static intStd(min, max) {
    //console.log('std');
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  static generateUUID() {
    const template = [1e7] + -1e3 + -4e3 + -8e3 + -1e11;
    const uuid = template.replace(/[018]/g, function (c) {
      const random = crypto.getRandomValues(new Uint8Array(1))[0];
      const value = (c ^ random & 15 >> c / 4).toString(16);
      return value;
    });
    return uuid;
  }
}

export {
  Random,
};
