/* */

import { network } from "./lib/network.js";

const mw = {
  logger: function (req, res, next) {
    const info = {
      ip: network.IP(req),
      host: network.Host(req),
      resource: req.url,
    };
    //console.log(info);
    console.log(info.ip, info.host, info.resource);
    next();
  },

};

export {
  mw,
};
