/* */

import express from "express";
import helmet from 'helmet';
import bodyParser from "body-parser";

import { config } from "./_config.js";
import { AppError } from "./a_lib/system.js";
import { send } from "./a_lib/network.js";
import { mw } from "./middlewares.js";

const app = express();
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

// routes
app.get("/version/v1", function (req, res) {
  res.status(200).json({ version: config.version });
});

app.use(mw.logger.bind(mw)); // avoid this undefined inside mw

app.use(function notFound(req, res, next) {
  next(new AppError(404, "Route Not Found"));
});

app.use(function errorHandler(err, req, res, next) {
  if (!err.isOperational) {
    console.error("Unexpected Error:", err.stack || err);
  }
  const status = err.status || 500;
  let message = "Internal Server Error";
  if (err.isOperational) {
    message = err.message;
  }
  send.JSONResult(res, status, { "Error": message }, false);
});

app.listen(config.port, function () {
  console.log(
    '\n*****************************************************\n',
    'process.env.pm.id => ', process.env.pm_id + "\n",
    'process.pid => ', process.pid + "\n",
    'Server', config.name.toUpperCase(),
    "version", config.version,
    "running on port", config.port, "\n" +
  '*****************************************************'
  );
});
