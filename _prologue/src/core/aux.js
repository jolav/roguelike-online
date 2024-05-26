/* */

console.log('Loading..... /core/aux.js');

const aux = {
  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  newPoint: function (x, y) {
    return {
      x: x,
      y: y,
    };
  }
};

export {
  aux,
};
