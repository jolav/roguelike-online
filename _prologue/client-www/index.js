/* */

console.log('Loading.....index.js');

import { c } from "./_config.js";

const init = {
  mode: "online",
  where: window.location.hostname,

  intro: async function () {
    console.log('#### INIT #####');
    document.getElementById("intro").style.display = "block";
    //document.getElementById("playZone").style.display = "none";
    await this.ping(); // once at least to get version
    document.getElementById("newGame").addEventListener("click", init.play);
    document.getElementById("prototype").addEventListener("click", function () {
      window.location.href = c.PROTOTYPE_URL;
    });
    const pinger = setInterval(this.ping, 1000);
    if (init.mode === "dev") { // auto start in dev mode
      clearTimeout(pinger);
      init.play();
    }

  },
  play: async function () {
    console.log('PLAY...');
    //document.getElementById("intro").style.display = "none";
    //document.getElementById("playZone").style.display = "block";
    //document.getElementById("versionPanel").innerHTML = c.VERSION;
    //document.body.style.overflow = "hidden";
  },
  ping: async function () {
    const start = Date.now();
    let response = await fetch(c.API_URL + c.PING_ENDPOINT);
    response = await response.json();
    response.lag = Date.now() - start;
    c.VERSION = response.version;
    document.getElementById("versionIntro").innerHTML = c.VERSION;
    const elePing = document.getElementById("ping");
    elePing.style.color = "#61868d";
    elePing.innerHTML = response.lag;
  },
  init: function () {
    // use localhost, with 127.0.0.1 cant see cookies value
    if (init.where === "localhost" || init.where === "127.0.0.1") {
      init.mode = "dev";
      c.API_URL = "http://localhost:3000";
    }
    init.intro();
  }
};

window.addEventListener('load', init.init);
