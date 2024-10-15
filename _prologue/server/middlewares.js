/* */

import { network } from "./a_lib/network.js";

const mw = {
  logger: function (req, res, next) {
    const info = {
      ip: network.IP(req),
      host: network.Host(req),
      resource: req.url,
    };
    console.log(info);
    next();
  },

};

export {
  mw,
};
