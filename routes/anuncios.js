"use strict";
const express = require("express");
const Anuncio = require("../models/Anuncio");
const regexp = require('regexp')
const { nameFilter, priceRangeFilter } = require("../lib/utils");
const { filter } = require("async");

const router = express.Router();

//GET /anuncios

router.get("/", async function (req, res, next) {
  try {
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    const select = req.query.select;

    const filters = {};

    const name = req.query.name
    let str = name.replace(/[aeiouèéêëáàäâìíîïòóôöùúûü]/,".");
    nameFilter(str, filters); //filtro auxiliar por primeras letras del user

    const offerAdvert = req.query.offeradvert;
  
    if (offerAdvert) filters.offerAdvert = offerAdvert;

    const price = req.query.price;
    priceRangeFilter(price, filters); //filtro auxiliar para el rango de precios

    const paymentMethod = req.query.paymentmethod;
    if (paymentMethod) filters.paymentMethod = paymentMethod;

    const tags = req.query.tags;
    if (tags) filters.tags = tags;

    const experience = req.query.experience;
    if (experience) filters.experience = experience;

    const allads = req.query.allads
    if (allads) filters.allads = res.send(allads);

    //TODO: falta el filtro de advertCreator

    const adverts = await Anuncio.customFind(
      filters,
      skip,
      limit,
      /*  sort */ select
    );

    res.json(adverts);
  } catch (err) {
    next(err);
  }
});

//GET /anuncios/:id

router.get("/:id", async function (req, res, next) {
  try {
    const advertId = req.params.id;
    const advert = await Anuncio.find({ _id: advertId });
    res.json({ result: advert });
  } catch (error) {
    next(error);
  }
});


module.exports = router;


