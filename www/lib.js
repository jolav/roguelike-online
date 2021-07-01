/* */
'use strict';

export {
  makeAsyncRequest
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

