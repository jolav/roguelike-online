/* */

console.log('Loading..... render_ascii.js');

import { t } from "./http.js";

function ascii() {
  const res = JSON.stringify(t, null, 3);
  document.getElementById("playingZone").innerText = res;
}

export {
  ascii
};
