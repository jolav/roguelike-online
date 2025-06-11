/* */

const aux = {
  sleep: function (sleepTime) {
    return new Promise(function (resolve) {
      setTimeout(resolve, sleepTime);
    });
  }
};

export {
  aux
};
