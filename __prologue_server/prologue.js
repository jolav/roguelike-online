/* */

import express from "express";
import helmet from 'helmet';
import bodyParser from "body-parser";

import { config } from "./_config.js";

const app = express();
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.get("/version", function (req, res) {
  res.status(200).json({ version: config.version });
});

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
  sendJSONResult(res, status, { "msg": message }, false);
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

const sendJSONResult = function (res, status, data, pretty) {
  if (pretty) {
    res.header('Content-Type', 'application/json');
    res.status(status).send(JSON.stringify(data, null, 2));
    return;
  }
  res.status(status).json(data);
};

class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.isOperational = true;
    Error.captureStackTrace(this, AppError);
  }
}

export {
  AppError
};
