/* */

console.log('Loading..... aux/aux.js');

const aux = {
  Sleep: function (min, max) {
    const delay = this.RandomInt(min, max);
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  },
  RandomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
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
  GenerateUUID: function () {
    const template = [1e7] + -1e3 + -4e3 + -8e3 + -1e11;
    const uuid = template.replace(/[018]/g, function (c) {
      const random = crypto.getRandomValues(new Uint8Array(1))[0];
      const value = (c ^ random & 15 >> c / 4).toString(16);
      return value;
    });
    return uuid;
  },
};

export {
  aux
};
