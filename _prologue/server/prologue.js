/* */

import express from "express";
import helmet from 'helmet';
import bodyParser from "body-parser";

import { config } from "./_config.js";
import { AppError } from "./a_lib/system.js";
import { send, network } from "./a_lib/network.js";
import { mw } from "./middlewares.js";
import { aux } from "./a_lib/aux.js";
import { Run } from "./run.js";
import { Runs } from "./runs.js";

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

app.get("/run", function (req, res) {
  const info = {
    nick: req.query.nick,
    id: aux.generateUUID(),
    created: Date.now(),
    ip: network.IP(req),
    turn: 0,
    lastTurn: Date.now()
  };
  const r = new Run(info);
  send.JSONResult(res, 200, r.prepareDataNew(), false);
});

app.get("/turn", async function (req, res) {
  const r = Runs.get(req.headers.authorization);
  if (r === undefined) {
    send.JSONResult(res, 400, {}, false);
    return;
  }
  const now = Date.now();
  if (now - r.info.lastTurn < config.tick) {
    send.JSONResult(res, 425, {}, false);
    return;
  }
  r.info.lastTurn = now;
  r.info.turn++;
  send.JSONResult(res, 200, r.prepareDataTurn(), false);
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
