/* */

console.log('Loading..... index.js');

import { config as c } from "./_config.js";
import { ask } from "./http.js";
import { g } from "./game.js";
import { listenKeyboard } from "./controls.js";

const index = {
  init: function () {
    const where = window.location.hostname;
    // use localhost, with 127.0.0.1 cant see cookies value
    if (where === "localhost" || where === "127.0.0.1") {
      c.MODE = "dev";
    } else {
      c.API.used = 0;
    }
    this.landingPage();
  },
  landingPage: async function () {
    console.log('##### INIT #####');
    this.showSection("landingPage");
    g.NICK = await ask.nick();
    [c.VERSION, c.LAG] = await ask.version();
    document.getElementById("nick").value = g.NICK;
    document.getElementById("version").innerHTML = "version_" + c.VERSION;
    document.getElementById("lag").innerHTML = c.LAG;
    if (c.MODE === "dev") {
      //this.play();
      //return;
    } else {
      pinger.init();
    }
    window.addEventListener('keydown', function pressAnyKey(ev) {
      if (ev.key === "Escape" || ev.key === "Enter") {
        window.removeEventListener("keydown", pressAnyKey);
        //this.alert("COMING SOON");
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
  play: async function () {
    console.log('PLAY');
    await ask.run();
    console.log(g);
    listenKeyboard();
    this.showSection("playZone");
  },
};

window.addEventListener("load", index.init.bind(index));

const pinger = {
  init: async function () {
    try {
      const [, b] = await ask.version();
      document.getElementById("lag").innerHTML = b;
      await this.sleep(c.PINGER_DELAY);
    } catch (error) {
      return;
    } finally {
      this.init();
    }
  },
  sleep: function (sleepTime) {
    return new Promise(function (resolve) {
      setTimeout(resolve, sleepTime);
    });
  }
};
