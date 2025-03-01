/* */

console.log('Loading..... client/lib/aux.js');

const aux = {
  sleep: function (min, max) {
    const delay = this.RandomInt(min, max);
    return new Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  },
};

export {
  aux
};
