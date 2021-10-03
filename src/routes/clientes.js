const { Router } = require('express');
const clienteController = require('../controllers/clienteController');

const router = Router();

router.get('', clienteController.index);
router.get('/:id', clienteController.find);
router.get('/:filter?', clienteController.findAllFilter);
router.post('', clienteController.create);
router.put('/:id', clienteController.update);
router.delete('/:id', clienteController.delete);

module.exports = router;
