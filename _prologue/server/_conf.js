/* */

console.log('Loading...../server/_conf.js');

const K = {
  VERSION: "0.0.1.1",
  MS_PER_TURN: 1000,
  // Render
  CAM_COLS: undefined,
  CAM_ROWS: undefined,
};

export {
  K,
  lib,
};

const lib = {
  sleep: function (ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  },
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  randomNick: function (nameLength, numbersLength) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
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
};

