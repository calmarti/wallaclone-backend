'use strict';

const express = require('express');
const upload = require('../lib/multerConfig');
const Advert = require('../models/Advert');
const { User } = require('../models');

const { nameFilter, priceRangeFilter } = require('../lib/utils');
const { sanitizeAdvertParams } = require('../utils/sanitize_params');
const jwtAuth = require('../lib/jwtAuth');
const { filter } = require('async');
const {
  tags: preloadedTags,
  paymentMethods: preloadedPaymentMethods,
} = require('../preloadedValues');
const router = express.Router();
//const protectedRouter = express.Router();

//GET /adverts

router.get("/", async function (req, res, next) {
  try {
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    const select = req.query.select;

    const filters = { publishState: true };

    const name = req.query.name;
    // str = name.replace(/[aeiouèéêëáàäâìíîïòóôöùúûü]/, '.');
    nameFilter(name, filters); //filtro auxiliar por primeras letras del nombre

    const sale = req.query.sale;

    if (sale) filters.sale = sale;

    const price = req.query.price;
    priceRangeFilter(price, filters); //filtro auxiliar para el rango de precios

    // const paymentMethods = req.query.paymentmethod;
    // if (paymentMethods) filters.paymentMethods = paymentMethods;

    const tags = req.query.tags;
    if (tags) filters.tags = tags;

    // const experience = req.query.experience;
    // if (experience) filters.experience = experience;


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

//GET /adverts/tags

//opción actual: tags predefinidos (el usuario no puede crearlos)

router.get("/tags", async (req, res, next) => {
  try {
    const tags = await Advert.allowedTags(preloadedTags);
    // const tags = await Advert.tagsList();        //para devolver tags no-predefinidos usar esta línea en vez de la anterior
    res.json({ ok: true, tags });
  } catch (err) {
    res.status(500).json({ ok: false, result: err.message });
  }
});

//POST /adverts/ Crear un nuevo Anuncio
router.post(
  "/",
  jwtAuth(),
  upload.single("photo"),
  async (req, res, next) => {
    try {
      
      console.log('file', req.file);
      // const advertParams = sanitizeAdvertParams(req.body);     // sanitazion comentado temporalmente para poder crear anuncio
      const user = await User.findOne({ _id: req.decodedUser._id });
      const advert = new Advert({
        advertCreator: req.decodedUser._id,
        createdBy: user.userName,
        updatedBy: user.userName,
        ...req.body,
        // ...advertParams,
      });
      // await advert.setPicture(req.file); // comentado para que funcione mientras no haya subida de imagen desde el front
      const saved = await advert.save();
      res.json({ ok: true, result: saved });
    } catch (err) {
      res.status(500).json({ ok: false, result: err });
      //next(err);
    }
  }
);

//GET /adverts/paymentMethods devuelve los métodos de pago predefinidos

// router.get('/paymentMethods', async (req, res, next) => {
//   try {
//     const paymentMethods = await Advert.allowedPaymentMethods(
//       preloadedPaymentMethods
//     );
//     res.json({ ok: true, result: paymentMethods });
//   } catch (err) {
//     res.status(500).json({ ok: false, result: err.message });
//   }
// });

//GET /adverts/favorites Devuelve Avisos favoritos de un usuario

// router.get("/favorites", jwtAuth(), async (req, res, next) => {
//   try {
//     const { query, decodedUser } = req;
//     const user = await User.find({
//       _id: query.userId || decodedUser._id,
//     });
//     const adverts = await Advert.find({
//       _id: user[0].favorites,
//     });
//     res.json({ ok: true, result: adverts });
//   } catch (err) {
//     res.status(500).json({ ok: false, result: err.message });
//   }
// });



//PUT /adverts/update_favorites Marca/Desmarca Anuncio como Favorito

// router.put("/update_favorites/", jwtAuth(), async (req, res, next) => {
//   try {
//     const user = await User.findOne({ _id: req.decodedUser._id });
//     const { advertId, setAsFavorite } = req.body;
//     let userFavorites = user.favorites;
//     if (!userFavorites.includes(advertId) && setAsFavorite) {
//       userFavorites = [...userFavorites, advertId];
//     }
//     if (!setAsFavorite) {
//       let index = userFavorites.indexOf(advertId);
//       if (index !== -1) {
//         userFavorites.splice(index, 1);
//       }
//     }
//     const updatedUser = await User.findOneAndUpdate(
//       { _id: user._id },
//       {
//         updatedBy: user.name,
//         favorites: userFavorites,
//       },
//       {
//         new: true,
//       }
//     );
//     if (!updatedUser) {
//       res.status(404).json({
//         ok: false,
//         error: "No se pudo actualizar o no se encontró el usuario",
//       });
//       return;
//     }
//     const { _id, favorites } = updatedUser;
//     res.json({ ok: true, result: { _id, favorites } });
//   } catch (err) {
//     res.status(500).json({ ok: false, result: err.message });
//   }
// });

//PUT /adverts/delete/:id Borrado lógico de anuncio

router.put("/delete/:id", jwtAuth(), async (req, res, next) => {
  try {
    const { advertId } = req.params;
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
        error: "No se pudo eliminar o no se encontró el anuncio",
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

router.put("/:id", jwtAuth(), async (req, res, next) => {
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
        error: "No se pudo actualizar o no se encontró el anuncio requerido",
      });
      return;
    }
    res.json({ ok: true, result: updatedAdvert });
  } catch (err) {
    res.status(500).json({ ok: false, result: err.message });
  }
});

//GET /adverts/:id Consulta un anuncio por su _id

router.get("/:id", async function (req, res, next) {
  try {
    const advertId = req.params.id;
    const advert = await Advert.find({ _id: advertId });
    res.json({ result: advert });
  } catch (error) {
    res.json({ ok: false, error: error.message });
  }
});

module.exports = router;
