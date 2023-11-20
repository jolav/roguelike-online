/* */

console.log('Loading.....index.js');

//import { c } from "./_config.js";

const init = {
  mode: "online",

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
    console.log('NEW GAME =>');
  },

  init: function () {
    const where = window.location.hostname;
    // use localhost, with 127.0.0.1 cant see cookies value
    if (where === "localhost" || where === "127.0.0.1") {
      init.mode = "dev";
    }
    init.intro();
  }
};

window.addEventListener('load', init.init);

