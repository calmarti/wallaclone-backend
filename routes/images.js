"use strict";
const express = require("express");
const { path } = require("../app");

const router = express.Router();

router.get('/:advertImg', function(req, res, next) {
    const img = process.env.IMAGE_URL_BASE_PATH + req.params.advertImg
    res.sendFile(img)
})

module.exports = router;