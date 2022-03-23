'use strict';
const jwt = require('jsonwebtoken');

module.exports = function () {
  // devuelve un middleware que si no hay usuario responde con error

  return function (req, res, next) {
    const token = req.body.token || req.query.token || req.get('Authorization');

    if (!token) {
      const err = new Error('no token provided');
      err.status = 401;
      return res.json({ ok: false, error: err.message });
    }

    // tengo token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        err.status = 401;
        return res.json({ ok: false, error: err.message });
      }
      req.decodedUser = decoded;
      next();
    });
  };
};
