"use strict";

const express = require("express");

//const upload = require('../lib/multerConfig');
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

//TODO: extender a subida de la imagen

router.post("/signup" /* upload.single('foto'), */, async (req, res, next) => {
  try {
    const hashedPassword = User.hashPassword(req.body.password);
    const fields = { ...req.body, password: hashedPassword };
    const newUser = await User.create(fields);
   // res.json({ ok: true, result: newUser });
    const saved = await newUser.save();
    res.status(201).json({ ok: true, result: saved });
  } catch (err) {
    res.status(500).json({ ok: false, result: err.message });
  }
});

//router.post('/login', async (req, res, next) => {
router.post("/signin", async (req, res, next) => {
  try {
    let email_userName = { email: req.body.email };
    if (!req.body.email) {
      email_userName = { userName: req.body.username };
    }
    const password = req.body.password;
    const hashedPassword = User.hashPassword(password);

    const user_credentials = { ...email_userName, password: hashedPassword };
    const user = await User.findOne(user_credentials);

    if (!user) {
      res.status(500).json({ ok: false, error: "invalid credentials" });
      return;
    }

    jwt.sign(
      { _id: user._id, ...email_userName },
      process.env.JWT_SECRET,
      {
        expiresIn: "15d",
      },
      (err, token) => {
        if (err) {
          return next(err);
        }
        res.json({ ok: true, token: token, userId: user._id });
        //res.json({ok: true, token: token, userName: user.userName});
      }
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
