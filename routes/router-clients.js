const Router = require('../lib/router');

const router = new Router({ prefix: 'clientes' });

const ClientService = require('../services/client-service');

const clientService = new ClientService();

/**
 * Get all all clients or clients by name
 */
router.get('/clientes', async (req) => {
	const filterName = req.query.filter || null;

	const result = await clientService.getAll(filterName);
	return result;
});

/**
 * Get Client by Id
 */
router.get('/clientes/:id', async (req) => {
	const result = await clientService.getById(req.params.id);

	return result;
});

/**
 * Insert Client
 */
router.post('/clientes', async (req, res) => {
	const result = await clientService.post(req.bodyParsed);

	return res(result, { statusCode: 201 });
});

/**
 * Update Client
 */
router.put('/clientes/:id', async (req) => {
	const result = await clientService.put(req.params.id, req.bodyParsed);

	return result;
});

/**
 * Delete Client
 */
router.delete('/clientes/:id', async (req, res) => {
	await clientService.delete(req.params.id);

	return res(null, { statusCode: 204 });
});

module.exports = router;
