"use strict";

const mongoose = require('mongoose')

const fsPromises = require('fs').promises
const fs = require('fs-extra')
const path = require('path')

//TODO: research como crear automáticamente el advertCreator al crear el anuncio

const anuncioSchema = mongoose.Schema({
  name: { type: String, index: true },  
  offerAdvert: {type: Boolean, index: true }, 
  description: { type: String },
  price: { type: Number, index: true },
  paymentMethod: { type: [String], index: true },
  tags: { type: [String], index: true },
  experience: { type: Number, index: true },
  // advertCreator: {type: ObjectId},       //TODO: research: como vincular advertCreator con _id  
  advertImage: { type: String },
  // publishState: {type: Boolean},    
  // underlinePart: {type: [String] },

});

anuncioSchema.set('timestamps', true);


anuncioSchema.statics.customFind = function (filters, skip, limit, /* sort, */ select) {
  const query = Anuncio.find(filters);
  query.sort([['createdAt', -1]])
  query.skip(skip);
  query.limit(limit);
  // query.sort(sort);
  query.select(select);

  return query.exec();
};


// Código extra para inicializar con install_db.js (no indispensable)

 anuncioSchema.statics.cargaJson = async function (fichero) {
  const data = await fsPromises.readFile(fichero, { encoding: 'utf8' })

  if (!data) {
    throw new Error(fichero + ' está vacio!')
  }

  const anuncios = JSON.parse(data).anuncios

  for (var i = 0; i < anuncios.length; i++) {
    await (new Anuncio(anuncios[i])).save()
  }

  return anuncios.length
}


const Anuncio = mongoose.model('Anuncio', anuncioSchema)

module.exports = Anuncio





