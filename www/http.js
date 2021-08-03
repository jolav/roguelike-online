/* */
'use strict';

import { a, conf } from "./_config.js";

export {
  fetchNewGame,
  fetchNewTurn,
  pingServer,
};

async function fetchNewGame() {
  let data = {};
  try {
    data = await makeAsyncRequest(conf.apiUrlBase + "/new", 'GET', null);
  } catch (err) {
    console.error("ERROR FETCHING NEW GAME => ", err);
  }
  return data;
}

async function fetchNewTurn(action) {
  let data = {};
  try {
    const param = "&action=" + action + "&token=" + a.token;
    data = await makeAsyncRequest(conf.apiUrlBase + "/action", 'POST', param);
  } catch (err) {
    console.error("ERROR FETCHING NEW TURN => ", err);
  }
  return data;
}

/*   const pingTime = await pingServer();*/
function pingServer() {
  return new Promise((resolve) => {
    const startTime = new Date();
    const img = new Image();
    img.onload = function () {
      const endTime = new Date();
      const pingTime = endTime.getTime() - startTime.getTime();
      resolve(pingTime);
    };
    img.src = "https://roguelike.online/_public/sprites/github48x48.png";
  });
}

function makeAsyncRequest(url, method, param) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        //console.log(xhr.response);
        resolve(JSON.parse(xhr.response));
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: xhr.status,
        statusText: xhr.statusText
      });
    };
    if (method === 'GET') {
      xhr.send();
    } else if (method !== 'GET') {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      if (param) {
        xhr.send(param);
      } else {
        xhr.send();
      }
    }
  });
}

