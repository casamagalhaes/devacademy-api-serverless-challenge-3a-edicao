const router = require('express').Router();

const ClientesService = require('../services/clientes-service');

const clientesService = new ClientesService();

/* Get All Clientes or Cliente by Nome if a filter
   is passed as query
*/
router.get('/clientes', async (req) => {
	const filterName = req.query.filter || null;
	const result = await clientesService.getAll(filterName);

	return result;
});

/* Get Cliente by Id */
router.get('/clientes/:id', async (req) => {
	const result = await clientesService.getById(req.params.id);

	return result;
});

/* Insert Cliente */
router.post('/clientes', async (req, res) => {
	const result = await clientesService.post(req.bodyParsed);

	return res(result, { statusCode: 201 });
});

/* Update Cliente */
router.put('/clientes/:id', async (req) => {
	const result = await clientesService.put(req.params.id, req.bodyParsed);

	return result;
});

/* Delete Cliente */
router.delete('/clientes/:id', async (req, res) => {
	await clientesService.delete(req.params.id);

	return res(null, { statusCode: 204 });
});

module.exports = router;
