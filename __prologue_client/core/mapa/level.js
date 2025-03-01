/* */

console.log('Loading..... core/mapa/level.js');

import { testRoom } from "./type/testRoom.js";
import { shelter } from "./type/shelter.js";

function generate(typeOfMap, view, rnd) {
  switch (typeOfMap) { // outdoors,indoors
    case "testRoom":
      return testRoom.create(view.cols, view.rows, rnd);
    case "shelter":
      return shelter.create();
  }
}

export {
  generate,
};
