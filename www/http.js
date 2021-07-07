/* */
'use strict';

import { a, conf } from "./_config.js";

async function fetchNewGame() {
  let data = {};
  try {
    data = await makeAsyncRequest(conf.apiUrlBase + "/new", 'GEt', null);
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

export {
  fetchNewGame,
  fetchNewTurn,
};

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

