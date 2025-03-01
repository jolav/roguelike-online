/* */

console.log('Loading..... client/index.js');

import { config as c } from "./_config.js";
import { ask, httpServer } from "./http.js";
import { g } from "./game.js";
import { listenKeyboard } from "./controls.js";

const index = {
  init: function () {
    const where = window.location.hostname;
    // use localhost, with 127.0.0.1 cant see cookies value
    if (where !== "localhost" && where !== "127.0.0.1") {
      c.API.AUTOSTART = false;
      c.API.HOST = 1;
    }
    this.landingPage();
  },
  landingPage: async function () {
    console.log('##### INIT #####');
    this.showSection("landingPage");
    g.info.NICK = await httpServer.nick();
    [c.VERSION, c.LAG] = await httpServer.version();
    document.getElementById("nick").value = g.info.NICK;
    document.getElementById("version").innerHTML = "version_" + c.VERSION;
    document.getElementById("lag").innerHTML = c.LAG;
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
    pinger.init();

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
  play: async function () {
    //console.log('PLAY');
    pinger.stop();
    listenKeyboard();
    this.showSection("playZone");
    if (c.AUTHORITATIVE_SERVER) {
      await httpServer.run();
    } else {
      await ask.run();
    }
  },
};

window.addEventListener("load", index.init.bind(index));

const pinger = {
  working: false,
  init: async function () {
    this.working = true;
    try {
      while (this.working) {
        const lag = await httpServer.ping();
        document.getElementById("lag").innerHTML = lag;
        await this.sleep(c.API.PINGER_DELAY);
      }
    } catch (error) {
      return;
    }
  },
  stop: function () {
    this.working = false;
  },
  sleep: function (sleepTime) {
    return new Promise(function (resolve) {
      setTimeout(resolve, sleepTime);
    });
  }
};
