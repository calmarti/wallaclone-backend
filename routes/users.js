'use strict';

const express = require('express');

//const upload = require('../lib/multerConfig');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');

//TODO: extender a subida de la imagen

router.post('/signup' /* upload.single('foto'), */, async (req, res, next) => {
  try {
    const hashedPassword = User.hashPassword(req.body.password);
    const fields = { ...req.body, password: hashedPassword };
    const newUser = await User.create(fields);

    // await anuncio.setFoto(req.file) // save image
    // const saved = await usuario.save();

    res.json({ ok: true, result: newUser });
  } catch (err) {
    res.status(500).json({ ok: false, result: err.message });
  }
});

router.post('/signin', async (req, res, next) => {
  try {
    let email_userName = { email: req.body.email };
    if (!req.body.email) {
      email_userName = { userName: req.body.userName };
    }
    const password = req.body.password;
    const hashedPassword = User.hashPassword(password);

    const user_credentials = { ...email_userName, password: hashedPassword };
    const user = await User.findOne(user_credentials);

    if (!user) {
      res.status(500).json({ ok: false, error: 'invalid credentials' });
      return;
    }

    jwt.sign(
      { _id: user._id, ...email_userName },
      process.env.JWT_SECRET,
      {
        expiresIn: '2d',
      },
      (err, token) => {
        if (err) {
          return next(err);
        }
        res.json({ ok: true, token: token, userId: user._id });
      }
    );
  } catch (err) {
    next(err);
  }
});

let chapuza = ""

router.get('/chat/:id', (req, res, next) => {
  try {
    let id = req.params.id
    const decodedJwt = jwt.decode(id, { complete: true });
    chapuza = decodedJwt.payload.email
    res.send(chapuza)
    //res.send(decodedJwt.payload.email)
  } catch (error) {
    res.send(error)
  }
})

router.get('/email', (req, res, next) => {
  try {
    res.send(chapuza)
  } catch (error) {
    res.send(error)
  }
})


module.exports = router;
