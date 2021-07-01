/* */
'use strict';

import { makeAsyncRequest } from "./lib.js";
import { conf } from "./_config.js";

async function init() {
  console.log('## Init ##');
  const newBtn = document.getElementById("newGame");
  newBtn.addEventListener("click", newGame);
}

async function newGame() {
  let data;
  try {
    data = await makeAsyncRequest(conf.apiUrlBase + "/new", 'GET', null);
  } catch (err) {
    console.error("ERROR FETCHING NEW GAME => ", err);
  }
  console.log('New Game => ', data);
}

window.addEventListener('load', init);
