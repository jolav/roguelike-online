/* */

console.log('Loading..... ./client/index.js');

import { config as c } from "./_config.js";
import { ask } from "./ask.js";
import { g } from "./game.js";
import { listenKeyboard } from "./controls.js";

const index = {
  init: function () {
    const where = window.location.hostname;
    // use localhost, with 127.0.0.1 cant see cookies value
    if (where === "localhost" || where === "127.0.0.1") {
      c.API.AUTOSTART = true;
      c.API.HOST = 1;
    }
    this.landingPage();
  },
  landingPage: async function () {
    console.log('##### INIT #####');
    this.showSection("landingPage");
    g.info.NICK = await ask.nick();
    c.VERSION = ask.version();
    document.getElementById("nick").value = g.info.NICK;
    document.getElementById("version").innerHTML = "version_" + c.VERSION;
    if (c.API.AUTOSTART) {
      this.play();
      return;
    }
    window.addEventListener('keydown', function pressAnyKey(ev) {
      if (ev.key === "Escape" || ev.key === "Enter") {
        window.removeEventListener("keydown", pressAnyKey);
        index.play();
      }
    });
  },
  showSection: function (section) {
    const section1 = document.getElementById("landingPage");
    const section2 = document.getElementById("playZone");
    //const section3 = document.getElementById("modal");
    section1.classList.remove("visible");
    section2.classList.remove("visible");
    //section3.classList.remove("visible");
    switch (section) {
      case "landingPage":
        section1.classList.add("visible");
        break;
      case "playZone":
        //document.getElementById("panel").style.width = c.PANEL_WIDTH + "px";
        section2.classList.add("visible");
        break;
      /*case "modal":
        section3.classList.add("visible");
        break;*/
    }
  },
  play: function () {
    listenKeyboard();
    this.showSection("playZone");
    ask.run();
  },
};

export {
  index
};
