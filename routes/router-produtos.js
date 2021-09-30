const router = require('express').Router();

const ProdutosService = require('../services/produtos-service');

const produtosService = new ProdutosService();

/* Get All Produtos or Produto by Nome if a filter 
   is passed as query.
 */
router.get('/produtos', async (req) => {
	const filterName = req.query.filter || null;

	const result = await produtosService.getAll(filterName);
	return result;
});

/* Get Produto by Id */
router.get('/produtos/:id', async (req) => {
	const result = await produtosService.getById(req.params.id);

	return result;
});

/* Insert Produto */
router.post('/produtos', async (req, res) => {
	const result = await produtosService.post(req.bodyParsed);

	return res(result, { statusCode: 201 });
});

/* Update Produto */
router.put('/produtos/:id', async (req) => {
	const result = await produtosService.put(req.bodyParsed);
	return result;
});

/* Delete Produto */
router.delete('/produtos/:id', async (req, res) => {
	await produtosService.delete(req.params.id);

	return res(null, { statusCode: 204 });
});

module.exports = router;
