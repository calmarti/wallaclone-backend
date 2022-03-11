"use strict";

const mongoose = require("mongoose");

const fsPromises = require("fs").promises;
const fs = require("fs-extra");
const path = require("path");

//TODO: research como crear automáticamente el advertCreator al crear el anuncio

const anuncioSchema = mongoose.Schema({
  name: { type: String, index: true },
  offerAdvert: { type: Boolean },
  description: { type: String },
  price: { type: Number },
  paymentMethod: { type: [String] },
  tags: { type: [String] },
  experience: { type: Number },
  // advertCreator: {type: ObjectId},       
  advertImage: { type: String },
  createdBy: {type: {String} }               //TODO: research: como vincular createBy con _id
  // publishState: {type: Boolean},
  // underlinePart: {type: [String] },
});

/*
  anuncioSchema = {
    name: limpieza de casa, *
    offerAdvert: true, *
    description: limpio casas, *
    price: 10 *
    paymentMethod: [cash, debit, credit] 
    tags: [salud, bienestar], *
    experience: 3,
    advertImage: ./public/src/images/foto.jpg
    createdBy: {name: Luis, userId: 0123123121475} *
    createdAt: 09-03-2022-19:20,
    updatedAt: 09-03-2022-19:20,
  }
*/

anuncioSchema.set("timestamps", true);

anuncioSchema.statics.customFind = function (
  filters,
  skip,
  limit,
  /* sort, */ select
) {
  const query = Anuncio.find(filters);
  query.sort([["createdAt", -1]]);
  query.skip(skip);
  query.limit(limit);
  // query.sort(sort);
  query.select(select);

  return query.exec();
};

// Código extra para inicializar con install_db.js (no indispensable)

anuncioSchema.statics.cargaJson = async function (fichero) {
  const data = await fsPromises.readFile(fichero, { encoding: "utf8" });

  if (!data) {
    throw new Error(fichero + " está vacio!");
  }

  const anuncios = JSON.parse(data).anuncios;

  for (var i = 0; i < anuncios.length; i++) {
    await new Anuncio(anuncios[i]).save();
  }

  return anuncios.length;
};

const Anuncio = mongoose.model("Anuncio", anuncioSchema);

module.exports = Anuncio;
