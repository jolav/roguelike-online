/* */

import express from "express";
import helmet from 'helmet';
import bodyParser from "body-parser";

import { K } from "./_konfig.js";
import { AppError } from "./lib/system.js";
import { send } from "./lib/network.js";
import { Run } from "./run.js";
import { Runs } from "./runs.js";

const app = express();
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.get("/version", function (req, res) {
  send.jsonResult(res, 200, { version: K.version }, true);
});

app.get("/run", function (req, res) {
  const r = new Run(req);
  send.jsonResult(res, 200, r.prepareDataNew(), false);
});

app.get("/turn", async function (req, res) {
  const r = Runs.get(req.headers.authorization);
  if (r === undefined) {
    send.jsonResult(res, 401, { msg: "Unauthorizated" }, false);
    return;
  }
  const now = Date.now();
  if (now - r.lastTurn < K.tick) {
    send.jsonResult(res, 425, { msg: "Too early" }, false);
    return;
  }
  // do action
  r.lastTurn = now;
  r.turn++;
  send.jsonResult(res, 200, r.prepareDataTurn(), false);
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
  send.jsonResult(res, status, { "msg": message }, false);
});

app.listen(K.port, function () {
  console.log(
    '\n*****************************************************\n',
    'process.env.pm.id => ', process.env.pm_id + "\n",
    'process.pid => ', process.pid + "\n",
    'Server', K.name.toUpperCase(),
    "version", K.version,
    "running on port", K.port, "\n" +
  '*****************************************************'
  );
});
