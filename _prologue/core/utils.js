/* */

console.log('Loading...../core/utils.js');

const utils = {
  randomNick: async function () {
    let nick = this.randomNick2(5, 2);
    const resp = await fetch("./../assets/surname.txt");
    if (!resp.ok) {
      return nick;
    }
    const txt = await resp.text();
    const lines = txt.split("\n");
    nick = lines[this.randomInt(0, lines.length - 1)];
    return nick;
  },
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  randomNick2: async function (nameLength, numbersLength) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    let nick = "";
    for (let i = 0; i < nameLength; i++) {
      nick += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    for (let i = 0; i < numbersLength; i++) {
      nick += nums.charAt(Math.floor(Math.random() * nums.length));
    }
    return nick;
  },
  randomString: function (length) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      randomString += chars.charAt(randomIndex);
    }
    return randomString;
  },
  Point: function (x, y) {
    this.x = x;
    this.y = y;
  },
};

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export {
  utils,
  Point,
};
