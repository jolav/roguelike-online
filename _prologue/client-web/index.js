/* */

console.log('Loading..... index.js');

import { ask } from "./http.js";
import { aux, c } from "./_config.js";
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
    await init.ping(); // once at least to get version and ping
    c.NICK = await aux.randomNick();
    document.getElementById("nick").value = c.NICK;
    const pinger = setInterval(init.ping, 1000);
    if (this.mode === "dev") {
      clearTimeout(pinger);
      init.play();
      return;
    }
    window.addEventListener('keydown', function pressAnyKey(ev) {
      if (ev.key === "Escape") {
        window.removeEventListener("keydown", pressAnyKey);
        clearTimeout(pinger);
        init.play();
      }
    });
  },
  ping: async function () {
    let lag = 0;
    [c.VERSION, lag] = await ask.ping();
    document.getElementById("ping").innerHTML = "Ping: " + lag;
    document.getElementById("version").innerHTML = "Version: " + c.VERSION;
  },
  play: function () {
    ask.game();
    init.showSection("playZone");
    listenKeyboard();
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
};

window.addEventListener("load", init.init);
