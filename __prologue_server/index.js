/* */

import express from "express";
import helmet from 'helmet';
import bodyParser from "body-parser";

import { K } from "./_konfig.js";
import { AppError } from "./lib/system.js";
import { send } from "./lib/network.js";
import { Run } from "./run.js";
import { Runs } from "./runs.js";
import { aux } from "./lib/aux.js";

const app = express();
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.get("/version", function (req, res) {
  send.jsonResponse(res, 200, { version: K.version }, true);
});

app.get("/run", function (req, res, next) {
  let nick = req.query.nick;
  if (nick === "" || nick === undefined) {
    next(new AppError(400, "Not valid nickname"));
    return;
  }
  nick = nick.toUpperCase();
  if (!aux.isAlphanumeric(nick)) {
    next(new AppError(400, "Nick contains invalid characters"));
    return;
  }
  const cols = parseInt(req.query.cols);
  const rows = parseInt(req.query.rows);
  if (cols < 3 || rows < 3 || cols > 300 || rows > 300 || isNaN(cols) || isNaN(rows)) {
    next(new AppError(400, "Invalid parameters value cols, rows"));
    return;
  }

  const r = new Run(req);
  send.jsonResponse(res, 200, r.prepareDataNew(), false);
});

app.get("/turn", async function (req, res, next) {
  const token = req.headers.authorization;
  const r = Runs.get(token);
  if (r === undefined) {
    next(new AppError(401, "Unauthorizated"));
    return;
  }
  const now = Date.now();
  if (now - r.lastTurn < K.tick) {
    next(new AppError(425, "Too Early"));
    return;
  }
  // do action
  r.lastTurn = now;
  r.turn++;
  send.jsonResponse(res, 200, r.prepareDataTurn(), false);
});

app.use(function notFound(req, res, next) {
  //send.error(res, 404, "Route Not Found");
  //next(new AppError(404, "Route Not Found"));
  throw new AppError(404, "Route Not Found");
});

app.use(function errorHandler(err, req, res, next) {
  if (!err.isOperational) {
    console.error("Unexpected Error:", err.stack || err);
  }
  const statusCode = err.status || 500;
  let message = "Internal Server Error";
  if (err.isOperational) {
    message = err.message;
  }
  send.error(res, statusCode, message, false);
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
