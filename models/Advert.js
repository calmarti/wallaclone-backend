"use strict";

const mongoose = require("mongoose");
const cote = require("cote");

const thumbnailRequester = new cote.Requester(
  {
    name: "thumbnail creator client",
  },
  { log: false, statusLogsEnabled: false }
);

const fsPromises = require("fs").promises;
const fs = require("fs-extra");
const path = require("path");

// const {
//   nameValidations,
//   priceValidations,
//   pictureValidations,
//   tagsValidations,
//   descriptionValidations,
//   experienceValidations,
//   paymentMethodsValidations,
// } = require('./validators');

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const advertSchema = Schema({
  name: { type: String, /* validate: nameValidations, */ index: true },
  price: { type: Number /* validate: priceValidations  */ },
  sale: { type: Boolean },
  tags: { type: [String] },
  photo: {type: String},
  // description: { type: String, /* validate: descriptionValidations */ },
  // paymentMethods: { type: [String] /* validate: paymentMethodsValidations */ },
  // tags: { type: [String], /* validate: tagsValidations */ },
  // experience: { type: Number /* , validate: experienceValidations */ },
  // advertCreator: { type: ObjectId },
  // createdBy: { type: { String } },
  // advertImage: { type: String /* pictureValidations */ },
  // publishState: { type: Boolean, default: true },
  updatedAt: { type: Date },
  // updatedBy: { type: String },
});

advertSchema.set("timestamps", true);

//Valores predefinidos de los tags
advertSchema.statics.allowedTags = function (preloadedTags) {
  return preloadedTags;
};

//Corre las validaciones al actualizar un anuncio para evitar que no se cumplan
advertSchema.pre("findOneAndUpdate", function (next) {
  this.options.runValidators = true;
  next();
});

advertSchema.statics.customFind = function (
  filters,
  skip,
  limit,
  /* sort, */ select
) {
  const query = Advert.find(filters);
  query.sort([["createdAt", -1]]);
  query.skip(skip);
  query.limit(limit);
  query.select(select);

  return query.exec();
};

//Agrega foto a Anuncio

advertSchema.methods.setPicture = async function ({
  path: imagePath,
  originalname: imageOriginalName,
}) {
  if (!imageOriginalName) return;
  const imagePublicPath = path.join(__dirname, "../uploads", imageOriginalName);
  await fs.copy(imagePath, imagePublicPath);

  this.advertImage = imageOriginalName;

  // Create thumbnail
  thumbnailRequester.send({ type: "createThumbnail", image: imagePublicPath });
};

// Código extra para inicializar con install_db.js (no indispensable)

advertSchema.statics.cargaJson = async function (fichero) {
  const data = await fsPromises.readFile(fichero, { encoding: "utf8" });
  if (!data) {
    throw new Error(fichero + " está vacio!");
  }

  const adverts = JSON.parse(data).adverts;
  for (var i = 0; i < adverts.length; i++) {
    await new Advert(adverts[i]).save();
  }

  return adverts.length;
};

advertSchema.statics.tagsList = async function () {
  const query = Advert.distinct("tags");
  const tags = query.exec();
  return tags;
};

const Advert = mongoose.model("Advert", advertSchema);

module.exports = Advert;
