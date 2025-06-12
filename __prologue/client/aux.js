/* */

console.log('Loading..... client/aux.js');

import { config as c } from "./_config.js";

const aux = {
  simpleNick: function (nameLength, numbersLength) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    let nick = "";
    for (let i = 0; i < nameLength; i++) {
      nick += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    nick += "-";
    for (let i = 0; i < numbersLength; i++) {
      nick += nums.charAt(Math.floor(Math.random() * nums.length));
    }
    return nick;
  },
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  currentDate: function (turn) {
    return new Date(c.PANEL.INIT_DATE.getTime() + c.PANEL.MS_PER_TURN * turn);
  },
  sleep: function (delay) {
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  },
};

export {
  aux
};
