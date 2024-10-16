/* */

console.log('Loading..... http.js');

import { config as c } from "./_config.js";

const ask = {
  nick: async function () {
    const path = c.NICK_API;
    const data = await fetchData(path, {});
    return data.name;
  },
  version: async function () {
    const start = performance.now();
    const path = c.API.url[c.API.used] + c.API.version;
    const data = await fetchData(path, {});
    const lag = (performance.now() - start);
    return [data.version, lag];
  },
};

export {
  ask,
};

async function fetchData(path, options) {
  try {
    const response = await fetch(path, options);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const msg = response.status + " " + response.statusText;
      console.log('ERROR 1 fetchData => ', msg);
      return undefined;
    }
  } catch (err) {
    console.log('ERROR 2 fetchData => ', err);
    return undefined;
  }
}
