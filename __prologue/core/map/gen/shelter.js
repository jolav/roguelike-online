/* */

console.log('Loading..... map/gen/shelter.js');

import { basicRoom } from "./basicRoom.js";

const shelter = {
  create: function name(view, rnd) {
    return basicRoom.create(view.cols, view.rows, rnd);
  }
};

export {
  shelter
};
