const express = require('express');

const router = express.Router();
const indexController = require('../controllers/index.controller');

router
    .get("/getall", indexController.getall)
    .get("/search", indexController.search);

module.exports = router;