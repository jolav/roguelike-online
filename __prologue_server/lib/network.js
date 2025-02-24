/* */

const send = {
  jsonResponse: function (res, statusCode, data, pretty) {
    try {
      if (pretty) {
        res.header('Content-Type', 'application/json');
        res.status(statusCode).send(JSON.stringify(data, null, 2));
        return;
      }
      res.status(statusCode).json(data);
    } catch (err) {
      console.error("ERROR lib/network.js 1", err);
      this.error(res, "Internal Server Error", 500);
    }
  },
  error: function (res, statusCode, msg) {
    switch (statusCode) {
      case 400:
        msg = "Bad Request! -> " + msg;
        break;
    }
    this.jsonResponse(res, statusCode, { error: msg }, false);
  },
};

const network = {
  ip: function (req) {
    return (
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress
    ).split(',')[0];
  },
  host: function (req) {
    return (
      req.get('Host') ||
      req.get('Origin') ||
      req.get('Referer') ||
      '?Host?'
    );
  },
};

export {
  send,
  network,
};
