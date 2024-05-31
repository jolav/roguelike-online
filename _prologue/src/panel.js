/* */

console.log('Loading..... panel.js');

import { c, aux } from "./_config.js";
import { t } from "./ask.js";

function update() {
  panel.nick();
  panel.version();
  panel.currentTime();
}

const panel = {
  nick: function () {
    document.getElementById("nick").innerHTML = c.NICK;
  },
  version: function () {
    document.getElementById("versionPanel").innerHTML = c.VERSION;
    document.getElementById("versionPanel").style.color = "lightgreen";
    document.getElementById("ping").innerHTML = c.LAG + "_" + c.TPT;
  },
  currentTime: function () {
    let aa = aux.currentDate(t.turn).toDateString().slice(4);
    let bb = aux.currentDate(t.turn).toTimeString().split(" ")[0];
    document.getElementById("date").innerHTML = " turn-> " + t.turn;//aa;
    document.getElementById("time").innerHTML = bb;
  },
};

export {
  update,
};
