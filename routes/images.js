"use strict";
const express = require("express");
const { path } = require("../app");

const router = express.Router();

router.get('/:advertImg', function(req, res, next) {
    res.sendFile(req.params.advertImg, {root: '../uploads/'})
})

module.exports = router;
