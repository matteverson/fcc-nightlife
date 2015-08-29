'use strict';

var express = require('express');
var controller = require('./search.service');

var router = express.Router();

//router.get('/', controller.index);
router.get('/:city', controller.search);

module.exports = router;
