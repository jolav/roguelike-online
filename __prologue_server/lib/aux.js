/* */

const aux = {
  sleep: function (min, max) {
    const delay = this.RandomInt(min, max);
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
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
  isAlphanumeric: function (input) {
    const re = /^[a-zA-Z0-9]+$/;
    return re.test(input);
  },
};

export {
  aux
};
