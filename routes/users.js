'use strict';

const express = require('express');

const upload = require('../lib/multerConfig');
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

//POST /auth/set_profile Setup del profile del usuario

router.post(
  '/setprofile/',
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
      userId: user.id,
      userName: user.userName,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ ok: false, result: err.message });
  }
});

//GET /auth/me Devuelve datos del usuario (id, email, userName) basado en el token

router.get('/get-user/:id', jwtAuth(), upload.any(), async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({
      _id: userId,
    });
    res.json({
      ok: true,
      userName: user.userName,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ ok: false, result: 'user not found' });
  }
});
module.exports = router;
