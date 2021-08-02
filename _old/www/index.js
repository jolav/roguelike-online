/* */
'use strict';

import * as router from "./router.js";

async function init() {
  console.log('## Init ##');
  router.landingPage();
}

window.addEventListener('load', init);

