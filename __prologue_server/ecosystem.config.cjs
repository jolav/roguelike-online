/* */

//const os = require("os");
//const cpus = os.cpus().length;

module.exports = {
  apps: [{
    name: "prologue",
    script: 'index.js',
    env: {
      NODE_ENV: "production",
    },
    ignore_watch: [
      "node_modules",
    ],
    instances: 1,
    max_memory_restart: "700M",
    output: `/home/${process.env.USER}/.mylogs/prologue/out.log`,
    error: `/home/${process.env.USER}/.mylogs/prologue/error.log`,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }]
};
