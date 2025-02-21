/* */

const Runs = new Map();

Runs.autoClean = function () {
  // cron job to remove/save inactive runs
};

Runs.list = function () {
  for (const [k, v] of Runs) {
    console.log(k, v);
  }
};

export {
  Runs,
};
