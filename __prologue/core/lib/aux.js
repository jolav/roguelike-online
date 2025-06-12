/* */

console.log('Loading..... core/lib/aux.js');

const aux = {
  InitializeMultiArray: function (cols, rows, value) {
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
  aux
};
