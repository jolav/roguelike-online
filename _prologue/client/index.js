/* */

console.log('Loading..... index.js');

import { config as c } from "./_config.js";
import { ask } from "./http.js";

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
    c.NICK = await ask.nick();
    pinger.init();
    [c.VERSION, c.LAG] = await ask.version();
    document.getElementById("nick").value = c.NICK;
    document.getElementById("version").innerHTML = "version_" + c.VERSION;
    document.getElementById("lag").innerHTML = c.LAG;
    if (c.MODE === "dev") {
      //this.play();
      //return;
    }
    window.addEventListener('keydown', function pressAnyKey(ev) {
      if (ev.key === "Escape" || ev.key === "Enter") {
        //window.removeEventListener("keydown", pressAnyKey);
        this.alert("COMING SOON");
        //this.play();
      }
    });
  },
  showSection: function (section) {
    const section1 = document.getElementById("landingPage");
    //const section2 = document.getElementById("playZone");
    //const section3 = document.getElementById("modal");
    section1.classList.remove("visible");
    //section2.classList.remove("visible");
    //section3.classList.remove("visible");
    switch (section) {
      case "landingPage":
        section1.classList.add("visible");
        break;
      /*case "playZone":
        document.getElementById("panel").style.width = c.PANEL_WIDTH + "px";
        section2.classList.add("visible");
        break;
      /*case "modal":
        section3.classList.add("visible");
        break;*/
    }
  },
  play: function () {
    console.log('PLAY');
  },
};

window.addEventListener("load", index.init.bind(index));

const pinger = {
  init: async function () {
    try {
      let b = "";
      [, b] = await ask.version();
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