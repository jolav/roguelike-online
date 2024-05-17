/* */

console.log('Loading..... index.js');

import { ask } from "./http.js";
import { aux, c } from "./_config.js";

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
    document.getElementById("landingPage").style.display = "block";
    document.getElementById("playingZone").style.display = "none";
    document.getElementById("modal").style.display = "none";
    await init.ping(); // once at least to get version and ping
    const nick = await aux.randomNick();
    document.getElementById("nick").value = nick;
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
    const data = await ask.ping();
    document.getElementById("ping").innerHTML = "Ping: " + data.lag;
    document.getElementById("version").innerHTML = "Version: " + data.version;
  },
  play: function () {
    const nick = document.getElementById("nick").value.toUpperCase();
    ask.game(nick);
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("playingZone").style.display = "block";
  },
};

window.addEventListener("load", init.init);
