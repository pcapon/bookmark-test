var express = require('express');
var router = express.Router();
const itemsController = require('../controllers/items.controller');

router.post('/', itemsController.insert);

router.get('/:itemId', itemsController.getById);

router.get('/', itemsController.getAll);

module.exports = router;
