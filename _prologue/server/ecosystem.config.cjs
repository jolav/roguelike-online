/* */

//const os = require("os");
//const cpus = os.cpus().length;

module.exports = {
  apps: [{
    name: "prologue",
    script: 'prologue.js',
    env: {
      NODE_ENV: "production",
    },
    ignore_watch: [
      "node_modules",
    ],
    //instances: cpus - 1,
    max_memory_restart: "1000M",
    output: `/home/${process.env.USER}/.myLogs/prologue/out.log`,
    error: `/home/${process.env.USER}/.myLogs/prologue/error.log`,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }]
};
