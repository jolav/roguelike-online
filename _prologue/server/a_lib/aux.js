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
  },
  generateUUID: function () {
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
