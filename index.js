/* */

console.log('Loading.....index.js');

import * as game from "./game.js";
import { actionKey } from "./controls.js";

const init = {
  mode: "online",
  where: window.location.hostname,

  intro: function () {
    console.log('#### INIT #####');
    document.getElementById("intro").style.display = "block";
    document.getElementById("playZone").style.display = "none";
    document.getElementById("newGame").addEventListener("click", init.play);
    if (init.mode === "dev") { // auto start in dev mode
      init.play();
    }
  },

  play: function () {
    document.getElementById("intro").style.display = "none";
    document.getElementById("playZone").style.display = "block";
    document.body.style.overflow = "hidden";
    game.begin();
    window.addEventListener('keydown', function (e) {
      const action = actionKey(e);
      if (action !== undefined) {
        game.newTurn(action);
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

