const express = require('express');

const router = express.Router();
const indexController = require('../controllers/index.controller');

router
    .get("/getall", indexController.getall)
    .post("/search", indexController.search);

module.exports = router;