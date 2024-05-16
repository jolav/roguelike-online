/* */

console.log('Loading..... index.js');

import { ask } from "./http.js";

const init = {
  init: function () {
    console.log('Init');
    /*const pinger =*/ setInterval(init.ping, 1000);
  },
  ping: async function () {
    const lag = await ask.ping();
    document.getElementById("ping").innerHTML = "Ping: " + lag;
  },
};

window.addEventListener("load", init.init);
