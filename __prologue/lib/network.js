/* */

const send = {
  JSONResult: function (res, status, data, pretty) {
    if (pretty) {
      res.header('Content-Type', 'application/json');
      res.status(status).send(JSON.stringify(data, null, 2));
      return;
    }
    res.status(status).json(data);
  },
};

const network = {
  IP: function (req) {
    return (
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress
    ).split(',')[0];
  },
  Host: function (req) {
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
