/* */

console.log('Loading..... /map/gen/shelter.js');

import { basicRoom } from "./basicRoom.js";

const shelter = {
  create: function name(cols, rows) {
    return basicRoom.create(cols, rows);
  }
};

export {
  shelter
};
