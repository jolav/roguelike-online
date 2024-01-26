/* */

console.log('Loading.....panel.js');

import { c } from "./_config.js";
import { t } from "./http.js";

function update() {
  panel.version();
  panel.stats();
}

const panel = {
  version: function () {
    document.getElementById("versionPanel").innerHTML = c.VERSION;
    document.getElementById("versionPanel").style.color = "#2cc0b4";
  },
  stats: function () {
    document.getElementById("nick").innerHTML = t.nick;
  }
};

export {
  update
};
