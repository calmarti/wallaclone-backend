"use strict";

const express = require("express");

const upload = require("../lib/multerConfig");
const router = express.Router();
const Usuario = require("../models/Usuario");

//TODO: hacer el hash del password al crear el usuario
//TODO: extender a subida de la imagen

router.post("/" /* upload.single('foto'), */, async (req, res, next) => {
  try {
    const usuario = new Usuario(req.body);
    // await anuncio.setFoto(req.file) // save image
    const saved = await usuario.save();
    res.json({ ok: true, result: saved });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
