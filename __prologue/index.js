/* */

console.log('Loading..... index.js');

import { index } from "./client/index.js";

window.addEventListener("load", index.init.bind(index));
/*window.addEventListener("load", function () {
  index.init();
});*/
