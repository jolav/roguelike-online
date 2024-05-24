/* */

console.log('Loading..... index.js');

import { c, aux } from "./_config.js";
import { ask } from "./ask.js";
import { listenKeyboard } from "./controls.js";

const init = {
  mode: "online",
  where: window.location.hostname,
  init: function () {
    // use localhost, with 127.0.0.1 cant see cookies value
    if (init.where === "localhost" || init.where === "127.0.0.1") {
      init.mode = "dev";
      c.API_URL = "http://localhost:3000";
    }
    init.landingPage();
  },
  landingPage: async function () {
    console.log('##### INIT #####');
    init.showSection("landingPage");
    c.NICK = await aux.randomNick();
    c.VERSION = ask.version();
    document.getElementById("nick").value = c.NICK;
    document.getElementById("version").innerHTML = "version_" + c.VERSION;
    if (this.mode === "dev") {
      init.play("new");
      return;
    }
    window.addEventListener('keydown', function pressAnyKey(ev) {
      if (ev.key === "Escape" || ev.key === "Enter") {
        window.removeEventListener("keydown", pressAnyKey);
        init.play("new");
      }
    });
  },
  showSection: function (section) {
    const section1 = document.getElementById("landingPage");
    const section2 = document.getElementById("playZone");
    const section3 = document.getElementById("modal");
    section1.classList.remove("visible");
    section2.classList.remove("visible");
    section3.classList.remove("visible");
    switch (section) {
      case "landingPage":
        section1.classList.add("visible");
        break;
      case "playZone":
        document.getElementById("panel").style.width = c.PANEL_WIDTH + "px";
        section2.classList.add("visible");
        break;
      case "modal":
        section3.classList.add("visible");
        break;
    }
  },
  play: function () {
    ask.turn("new");
    init.showSection("playZone");
    listenKeyboard();
  },
};

window.addEventListener("load", init.init);
