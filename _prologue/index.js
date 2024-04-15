/* */

console.log("Loading.....index.js");

import { c } from "./_config.js";
import { ask } from "./http.js";
import { listenKeyboard } from "./controls.js";

const init = {
  mode: "online",
  where: window.location.hostname,
  init: function () {
    // use localhost, with 127.0.0.1 cant see cookies value
    if (init.where === "localhost" || init.where === "127.0.0.1") {
      init.mode = "dev";
    }
    init.landingPage();
  },
  landingPage: async function () {
    console.log('#### INIT #####');
    document.getElementById("landingPage").style.display = "block";
    document.getElementById("playZone").style.display = "none";
    await init.ping(); // once at least to get version
    document.getElementById("ping").style.color = "#61868d";
    document.getElementById("newGame").addEventListener("click", function () {
      clearTimeout(pinger);
      init.play();
    });
    const pinger = setInterval(init.ping, 1000);
    if (init.mode === "dev") { // auto start in dev mode
      clearTimeout(pinger);
      init.play();
    }
  },
  play: function () {
    ask.turn("new");
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("playZone").style.display = "block";
    document.getElementById("versionPanel").innerHTML = c.VERSION;
    document.getElementById("ping2").innerHTML = c.LAG;
    document.body.style.overflow = "hidden";
    listenKeyboard();
  },
  ping: async function () {
    [c.VERSION, c.LAG] = await ask.ping();
    document.getElementById("versionIntro").innerHTML = c.VERSION;
    document.getElementById("ping").innerHTML = c.LAG;
  }
};

window.addEventListener("load", init.init);

