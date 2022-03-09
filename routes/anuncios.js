'use strict';
const express = require('express');
const Anuncio = require("../models/Anuncio");

const { nameFilter, priceRangeFilter } = require('../lib/utils');
const { filter } = require('async');

const router = express.Router();

//GET /anuncios

router.get('/', async function (req, res, next) {

    try {

        const skip = parseInt(req.query.skip);
        const limit = parseInt(req.query.limit);
   
        const select = req.query.select;

        const filters = {};
        
        const name = req.query.name;
        nameFilter(name, filters);       //filtro auxiliar por primeras letras del nombre

        const offerAdvert = req.query.offeradvert;
        console.log(req.query.offerAdvert);
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

        const adverts = await Anuncio.customFind(filters, skip, limit,/*  sort */ select);


        res.json({ result: adverts });
    }


    catch (err) {
        next(err);
    }
});

//GET /anuncios/:id


module.exports = router;


// 'use strict'

// const router = require('express').Router()
// const { Anuncio } = require('../models')

// /* GET anuncios page. */
// router.get('/', async function (req, res, next) {
//   try {
//     const start = parseInt(req.query.start) || 0
//     const limit = parseInt(req.query.limit) || 1000 // nuestro api devuelve max 1000 registros
//     const sort = req.query.sort || '_id'
//     const includeTotal = true

//     const filters = {}
//     if (req.query.tag) {
//       filters.tags = req.query.tag
//     }
//     if (req.query.venta) {
//       filters.venta = req.query.venta
//     }

//     const {total, rows} = await Anuncio.list(filters, start, limit, sort, includeTotal)
//     res.render('anuncios', { total, anuncios: rows })
//   } catch (err) { return res.next(err) }
// })

// module.exports = router

//o bien:

// 'use strict'

// const express = require('express')
// const upload = require('../../lib/multerConfig')
// const router = express.Router()
// const { Anuncio } = require('../../models')

// router.get('/', (req, res, next) => {
//   const start = parseInt(req.query.start) || 0
//   const limit = parseInt(req.query.limit) || 1000 // nuestro api devuelve max 1000 registros
//   const sort = req.query.sort || '_id'
//   const includeTotal = req.query.includeTotal === 'true'
//   const filters = {}
//   if (typeof req.query.tag !== 'undefined') {
//     filters.tags = req.query.tag
//   }

//   if (typeof req.query.venta !== 'undefined') {
//     filters.venta = req.query.venta
//   }

//   if (typeof req.query.precio !== 'undefined' && req.query.precio !== '-') {
//     if (req.query.precio.indexOf('-') !== -1) {
//       filters.precio = {}
//       let rango = req.query.precio.split('-')
//       if (rango[0] !== '') {
//         filters.precio.$gte = rango[0]
//       }

//       if (rango[1] !== '') {
//         filters.precio.$lte = rango[1]
//       }
//     } else {
//       filters.precio = req.query.precio
//     }
//   }

//   if (typeof req.query.nombre !== 'undefined') {
//     filters.nombre = new RegExp('^' + req.query.nombre, 'i')
//   }

//   Anuncio.list(filters, start, limit, sort, includeTotal).then(anuncios => {
//     res.json({ ok: true, result: anuncios })
//   }).catch(err => next(err))
// })

// router.post('/', upload.single('foto'), async (req, res, next) => {
//   try {
//     const anuncio = new Anuncio(req.body)

//     await anuncio.setFoto(req.file) // save image

//     const saved = await anuncio.save()
//     res.json({ok: true, result: saved})
//   } catch (err) { next(err) }
// })

// // Return the list of available tags
// router.get('/tags', function (req, res) {
//   res.json({ ok: true, allowedTags: Anuncio.allowedTags() })
// })

// module.exports = router