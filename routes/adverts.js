'use strict';

const express = require('express');
const upload = require('../lib/multerConfig');
const Advert = require('../models/Advert');
const { User } = require('../models');

const { nameFilter, priceRangeFilter } = require('../lib/utils');
const { sanitizeAdvertParams } = require('../utils/sanitize_params');
const jwtAuth = require('../lib/jwtAuth');
const { filter } = require('async');

const router = express.Router();
//const protectedRouter = express.Router();

//GET /adverts

router.get('/', async function (req, res, next) {
  try {
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    const select = req.query.select;

    const filters = { publishState: true };

    const name = req.query.name;
    // str = name.replace(/[aeiouèéêëáàäâìíîïòóôöùúûü]/, '.');
    nameFilter(name, filters); //filtro auxiliar por primeras letras del nombre

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

    //TODO: falta el filtro de advertCreator

    const adverts = await Advert.customFind(
      filters,
      skip,
      limit,
      /*  sort */ select
    );

    res.json(adverts);
  } catch (err) {
    res.status(500).json({ ok: false, result: err.message });
  }
});

//GET /adverts/tags Devuelve los tags usados en los anuncios existentes

router.get('/tags', async (req, res, next) => {
  try {
    const tags = await Advert.tagsList();
    res.json({ ok: true, result: tags });
  } catch (err) {
    res.status(500).json({ ok: false, result: err.message });
  }
});

//GET /adverts/favorites Devuelve Avisos favoritos de un usuario

router.get('/favorites', jwtAuth(), async (req, res, next) => {
  try {
    const { query, decodedUser } = req;
    const user = await User.find({
      _id: query.userId || decodedUser._id,
    });
    const adverts = await Advert.find({
      _id: user[0].favorites,
    });
    res.json({ ok: true, result: adverts });
  } catch (err) {
    res.status(500).json({ ok: false, result: err.message });
  }
});

//POST /adverts/ Crear un nuevo Anuncio
router.post(
  '/',
  jwtAuth(),
  upload.single('advertImage'),
  async (req, res, next) => {
    try {
      const advertParams = sanitizeAdvertParams(req.body);
      const user = await User.findOne({ _id: req.decodedUser._id });
      const advert = new Advert({
        advertCreator: req.decodedUser._id,
        createdBy: user.name,
        updatedBy: user.name,
        ...advertParams,
      });
      await advert.setPicture(req.file);
      const saved = await advert.save();
      res.json({ ok: true, result: saved });
    } catch (err) {
      res.status(500).json({ ok: false, result: err.message });
      //next(err);
    }
  }
);

//PUT /adverts/update_favorites Marca/Desmarca Anuncio como Favorito

router.put('/update_favorites/', jwtAuth(), async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.decodedUser._id });
    const { advertId, setAsFavorite } = req.body;
    let userFavorites = user.favorites;
    if (!userFavorites.includes(advertId) && setAsFavorite) {
      userFavorites = [...userFavorites, advertId];
    }
    if (!setAsFavorite) {
      let index = userFavorites.indexOf(advertId);
      if (index !== -1) {
        userFavorites.splice(index, 1);
      }
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        updatedBy: user.name,
        favorites: userFavorites,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      res.status(404).json({
        ok: false,
        error: 'No se pudo actualizar o no se encontró el usuario',
      });
      return;
    }
    const { _id, favorites } = updatedUser;
    res.json({ ok: true, result: { _id, favorites } });
  } catch (err) {
    res.status(500).json({ ok: false, result: err.message });
  }
});

//PUT /adverts/delete/:id Borrado lógico de anuncio

router.put('/delete/', jwtAuth(), async (req, res, next) => {
  try {
    const { advertId } = req.body;
    const user = await User.findOne({ _id: req.decodedUser._id });
    const deletedAdvert = await Advert.findOneAndUpdate(
      { _id: advertId },
      {
        updatedBy: user.name,
        publishState: false,
      },
      {
        new: true,
      }
    );
    if (!deletedAdvert) {
      res.status(404).json({
        ok: false,
        error: 'No se pudo eliminar o no se encontró el anuncio',
      });
      return;
    }
    const { _id } = deletedAdvert;
    res.json({ ok: true, result: { _id } });
  } catch (err) {
    res.status(500).json({ ok: false, result: err.message });
  }
});

//PUT /adverts/:id Modificar un Anuncio

router.put('/:id', jwtAuth(), async (req, res, next) => {
  try {
    const advertParams = sanitizeAdvertParams(req.body);
    const user = await User.findOne({ _id: req.decodedUser._id });
    const filter = { _id: req.params.id };
    const updatedAdvert = await Advert.findOneAndUpdate(
      filter,
      { updatedBy: user.name, ...advertParams },
      {
        new: true,
      }
    );
    if (!updatedAdvert) {
      res.status(404).json({
        ok: false,
        error: 'No se pudo actualizar o no se encontró el anuncio',
      });
      return;
    }
    res.json({ ok: true, result: updatedAdvert });
  } catch (err) {
    res.status(500).json({ ok: false, result: err.message });
  }
});

//GET /adverts/:id Consulta un anuncio por su _id

router.get('/:id', async function (req, res, next) {
  try {
    const advertId = req.params.id;
    const advert = await Advert.find({ _id: advertId });
    res.json({ result: advert });
  } catch (error) {
    res.json({ ok: false, error: error.message });
  }
});

module.exports = router;
