const express = require('express');
const produtoController = require('../controllers/produtoController');

const router = express.Router();

router.get('/', produtoController.index);
router.get('/:filter?', produtoController.findAllFilter);
router.get('/:id', produtoController.find);
router.post('', produtoController.create);
router.put('/:id', produtoController.update);
router.delete('/:id', produtoController.delete);

module.exports = router;
