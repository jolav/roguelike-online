/* */

const aux = {
  Sleep: function (min, max) {
    const delay = this.RandomInt(min, max);
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  },
  RandomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
};

export {
  aux
};
