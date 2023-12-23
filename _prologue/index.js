/* */

console.log('Loading.....index.js');

import { C } from "./_config.js";
import { ask } from "./ask.js";

const init = {
  mode: "online",
  where: window.location.hostname,

  intro: function () {
    console.log('#### INIT #####');
    document.getElementById("intro").style.display = "block";
    document.getElementById("playZone").style.display = "none";
    ask.version(function () {
      document.getElementById("versionIntro").innerHTML = C.VERSION;
    });
    document.getElementById("newGame").addEventListener("click", init.play);
    if (init.mode === "dev") { // auto start in dev mode
      init.play();
    }
  },
  play: async function () {
    document.getElementById("intro").style.display = "none";
    document.getElementById("playZone").style.display = "block";
    document.getElementById("versionPanel").innerHTML = C.VERSION;
    document.body.style.overflow = "hidden";
    ask.run();
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

