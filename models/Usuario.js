"use strict";

//TODO: ¿ponemos un atributo 'required'?
//TODO: crear el hash de la contraseña
//TODO: implementar campo 'favorites' de tipo [ObjectId] (buscar type equivalente a ObjectId)

const mongoose = require("mongoose");
var hash = require("hash.js");

const usuarioSchema = mongoose.Schema({
  name: { type: String, unique: true },   
  email: { type: String, unique: true },
  password: { type: String },
  passwordConfirm: { type: String },
  offer: { type: Boolean },
  phone: { type: Number },
  url: { type: String },
  description: { type: String },
  rating: { type: Number },
  // userImage: { type: File },
  // favorites: { type: [ObjectId] },
});

usuarioSchema.statics.hashPassword = function (plain) {
  return hash.sha256().update(plain).digest("hex");
};

usuarioSchema.set("timestamps", true);

var Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
