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
  },
  initializeMultiArray: function (cols, rows, value) {
    let array = [];
    for (let i = 0; i < cols; i++) {
      array[i] = [];
      for (let j = 0; j < rows; j++) {
        array[i][j] = value;
      }
    }
    return array;
  },
};

export {
  aux,
};
