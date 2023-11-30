/* */

console.log('Loading.....index.js');

import { r } from "./run.js";
import { actionKey } from "./controls.js";
import { K } from "./_config.js";

const init = {
  mode: "online",
  where: window.location.hostname,

  intro: function () {
    console.log('#### INIT #####');
    document.getElementById("intro").style.display = "block";
    document.getElementById("playZone").style.display = "none";
    document.getElementById("versionIntro").innerHTML = K.VERSION;
    document.getElementById("newGame").addEventListener("click", init.play);
    if (init.mode === "dev") { // auto start in dev mode
      init.play();
    }
  },

  play: function () {
    document.getElementById("intro").style.display = "none";
    document.getElementById("playZone").style.display = "block";
    document.getElementById("versionPanel").innerHTML = K.VERSION;
    document.body.style.overflow = "hidden";
    r.start();
    window.addEventListener('keydown', function (e) {
      const action = actionKey(e);
      if (action !== undefined) {
        r.newTurn(action);
      }
    });
  },

  init: function () {
    // use localhost, with 127.0.0.1 cant see cookies value
    if (init.where === "localhost" || init.where === "127.0.0.1") {
      init.mode = "dev";
    }
    init.intro();
  }
};

window.addEventListener('load', init.init);

