/* */

console.log('Loading..... /map/gen/gen.js');

import { basicRoom } from "./basicRoom.js";
import { shelter } from "./shelter.js";

function mapGen(typeOfMap, view, rnd) {
  switch (typeOfMap) { // outdoors,indoors
    case "basicRoom":
      return basicRoom.create(view.cols, view.rows, rnd);
    case "shelter":
      return shelter.create(view.cols, view.rows, rnd);
  }
}

export {
  mapGen
};
