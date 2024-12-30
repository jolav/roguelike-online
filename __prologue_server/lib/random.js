/* */

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
    console.log('seed');
    return Math.floor(this.random() * (max - min + 1) + min);
  }
  static int(min, max) {
    console.log('std');
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

/*
const r1 = new Random(1);
const r2 = new Random(1);
const r3 = new Random(2);
let result1 = "";
let result2 = "";
let result3 = "";
for (let i = 0; i < 50; i++) {
  result1 += r1.int(1, 6) + "";
  result2 += r2.int(1, 6) + "";
  result3 += r3.int(1, 6) + "";
}
console.log(Random.int(1, 10));
console.log(result1);
console.log(result2);
console.log(result3);
*/
