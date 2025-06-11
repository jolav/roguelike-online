/* */

console.log('Loading..... index.js');

import { config as c } from "./_config.js";
import { http } from "./http.js";
import { g } from "./game.js";
import { listenKeyboard } from "./controls.js";
import { aux } from "./aux/aux.js";

const index = {
  init: function () {
    const where = window.location.hostname;
    // use localhost, with 127.0.0.1 cant see cookies value
    if (where === "localhost" || where === "127.0.0.1") {
      c.API.AUTOSTART = true;
      c.API.HOST = 0;
    }
    this.landingPage();
  },
  landingPage: async function () {
    console.log('##### INIT #####');
    this.showSection("landingPage");
    g.info.NICK = await http.nick();
    [g.info.VERSION, g.lag.network] = await http.version();
    document.getElementById("nick").value = g.info.NICK;
    document.getElementById("version").innerHTML = "version_" + g.info.VERSION;
    document.getElementById("lag").innerHTML = g.lag.network;
    if (c.API.AUTOSTART) {
      this.play();
      return;
    } else {
      pinger.start();
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
    pinger.stop();
    listenKeyboard();
    //this.showSection("playZone");
    //http.run();
  },
};

const pinger = {
  running: false,
  do: async function () {
    if (!this.running) {
      return;
    }
    try {
      const [, b] = await http.version();
      document.getElementById("lag").innerHTML = b;
      await aux.sleep(c.API.PINGER_DELAY);
    } catch (error) {
      return;
    } finally {
      this.do();
    }
  },
  start: function () {
    if (!this.running) {
      this.running = true;
      this.do();
    }
  },
  stop: function () {
    this.running = false;
  }
};

window.addEventListener("load", index.init.bind(index));
/*window.addEventListener("load", function () {
  index.init();
});*/
