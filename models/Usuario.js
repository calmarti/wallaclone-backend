"use strict";

//TODO: ¿ponemos un atributo 'required'?
//TODO: crear el hash de la contraseña
//TODO: implementar campo 'favorites' de tipo [ObjectId] (buscar type equivalente a ObjectId)

const mongoose = require("mongoose");
var hash = require("hash.js");

const usuarioSchema = mongoose.Schema({
  userName: { type: String, unique: true, index: true},
  email: { type: String, unique: true },
  name: { type: String },
  password: { type: String },
  // offer: { type: Boolean },
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


//TODO actualizar usuarioSchema
//TODO crear esquema perfil

/*
  userSchema = {
    username: {type:string, unique},
    email: {type:string, unique},
    password: {type:string}
  }

  profileSchema = {
    name: { type: String },
    email: {type: {String, Boolean} }, //También se puede hacer en un campo
    phone: {type: {String, Boolean} },
    url: { type: String },
    description: { type: String },
    rating: { type: Number },
    photo: { type: String },
    // cv: { type:String } //si da tiempo
  }

*/