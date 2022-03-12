"use strict";


//TODO: implementar campo 'favorites' de tipo [ObjectId] (buscar type equivalente a ObjectId)

const mongoose = require("mongoose");
var hash = require("hash.js");

const usuarioSchema = mongoose.Schema({
  userName: { type: String,  required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true  },
  password: { type: String, required: true },
  // offer: { type: Boolean },
  phone: { type: Number, required:true },
  description: { type: String, required: true },
  url: { type: String },
  // userImage: { type: File },
  // rating: { type: Number },
  // favorites: { type: [ObjectId] },
  // cv: { type:String } //si da tiempo
});

usuarioSchema.statics.hashPassword = function (plain) {
  console.log("plain", plain)
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
