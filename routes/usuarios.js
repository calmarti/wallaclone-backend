"use strict";

const express = require("express");

const upload = require("../lib/multerConfig");
const router = express.Router();
const Usuario = require("../models/Usuario");

//TODO: extender a subida de la imagen

router.post("/" /* upload.single('foto'), */, async (req, res, next) => {
  try {
    const hashedPassword = Usuario.hashPassword(req.body.password);
    const fields = { ...req.body, password: hashedPassword };
    const newUser = await Usuario.create(fields);

    // await anuncio.setFoto(req.file) // save image
    // const saved = await usuario.save();

    res.json({ ok: true, result: newUser });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
