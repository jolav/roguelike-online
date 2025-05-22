/* */

console.log('Loading..... /core/lib/random.js');

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
  int(min, max) {
    return Math.floor(this.random() * (max - min + 1) + min);
  }
  static stdInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  static generateUUID() {
    const template = [1e7] + -1e3 + -4e3 + -8e3 + -1e11;
    const uuid = template.replace(/[018]/g, function (c) {
      const myrandom = crypto.getRandomValues(new Uint8Array(1))[0];
      const value = (c ^ myrandom & 15 >> c / 4).toString(16);
      return value;
    });
    return uuid;
  }
  static generateSeed() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0];
  }
}

export {
  Random
};
