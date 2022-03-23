'use strict';

const express = require('express');

const upload = require('../lib/multerConfig');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_SENDER,
    pass: process.env.MAILER_PASSWORD,
  },
});

const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtAuth = require('../lib/jwtAuth');
const UserProfile = require('../models/UserProfile');

const { sanitizeUserProfileParams } = require('../utils/sanitize_params');

router.post('/signup', async (req, res, next) => {
  try {
    const hashedPassword = User.hashPassword(req.body.password);
    const fields = { ...req.body, password: hashedPassword };
    const newUser = await User.create(fields);
    if (newUser) {
      transporter.sendMail(
        {
          from: `Starkers ${process.env.MAILER_SENDER}`,
          to: newUser.email,
          subject: 'Bienvenido a WallaClone',
          html: '<h3>Bienvenido a WallaClone</h3><br><br> Gracias por registrarte en nuestra plataforma. Esperamos que disfrutes de esta herammienta que hemos puesto a tu disposición. <br><br> Cualquier duda, puedes contactarnos en keepcodingstarkers@gmail.com',
        },
        function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        }
      );
    }
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
        transporter.se;
        res.json({ ok: true, token: token });
      }
    );
  } catch (err) {
    next(err);
  }
});

//POST /auth/set_profile Setup del profile del usuario

router.post(
  '/set-profile/',
  jwtAuth(),
  upload.single('userImage'),
  async (req, res, next) => {
    try {
      const sanitizedParams = sanitizeUserProfileParams(req.body);
      const { decodedUser } = req;
      let profile = await UserProfile.findOneAndUpdate(
        { userId: decodedUser._id },
        { ...sanitizedParams },
        { new: true }
      );
      if (!profile) {
        profile = await UserProfile.create({
          userId: decodedUser._id,
          ...sanitizedParams,
        });
      }
      await profile.setPicture(req.file);
      const savedProfile = await profile.save();
      res.json({ ok: true, result: savedProfile });
    } catch (err) {
      res.status(500).json({ ok: false, result: err.message });
    }
  }
);

//GET /auth/me Devuelve datos del usuario (id, email, userName) basado en el token

router.get('/me', jwtAuth(), upload.any(), async (req, res, next) => {
  try {
    const { decodedUser } = req;
    const user = await User.findOne({
      _id: decodedUser._id,
    });
    res.json({
      ok: true,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ ok: false, result: err.message });
  }
});

//GET /auth/forgot-password Envía correo para restablecer la contraseña del usuario

router.get(
  '/forgot-password',
  jwtAuth(),
  upload.any(),
  async (req, res, next) => {
    const token = req.headers['authorization'];
    try {
      const { decodedUser } = req;
      const user = await User.findOne({
        _id: decodedUser._id,
      });
      transporter.sendMail(
        {
          from: `Starkers <${process.env.MAILER_SENDER}>`,
          to: user.email,
          subject: 'Restablecer Contraseña',
          html: `<h3>Restablecer Contraseña</h3><br> Para restablecer tu contraseña, haz click en el siguiente link: <a href="${process.env.FRONT_END_URL}:${process.env.FRONT_END_PORT}/restore-password?token=${token}">Restablecer Contraseña</a>`,
        },
        function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        }
      );
      res.json({
        ok: true,
        userId: user.id,
        userName: user.userName,
        email: user.email,
      });
    } catch (err) {
      res.status(500).json({ ok: false, result: err.message });
    }
  }
);

//PUT /auth/restore-password restablece el password de usuario

router.put(
  '/restore-password',
  upload.any(),
  jwtAuth(),
  async (req, res, next) => {
    try {
      const { decodedUser } = req;
      const { new_password } = req.body;
      const hashedPassword = User.hashPassword(new_password);
      await User.findOneAndUpdate(
        {
          _id: decodedUser._id,
        },
        {
          password: hashedPassword,
        }
      );
      console.log('user', decodedUser);
      res.json({
        ok: true,
        result: 'El password se ha cambiado',
      });
    } catch (err) {
      res.status(500).json({ ok: false, result: err.message });
    }
  }
);

module.exports = router;
