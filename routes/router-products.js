const Router = require('../lib/router');

const router = new Router({ prefix: 'produtos' });

const ProductService = require('../services/product-service');

const productService = new ProductService();

/**
 * Get All products or product by name
 */
router.get('/', async (req) => {
	const filterName = req.query ? req.query : undefined;

	const result = await productService.findAll(filterName);
	return result;
});

/**
 * Get product by Id
 */
router.get('/{id}', async (req) => {
	const result = await productService.findById(req.params.id);

	return result;
});

/**
 * Insert product
 */
router.post('/', async (req, res) => {
	const result = await productService.post(req.bodyParsed);

	return res(result, { statusCode: 201 });
});

/**
 * Update product
 */
router.put('/{id}', async (req) => {
	const result = await productService.put(req.params.id, req.bodyParsed);
	return result;
});

/**
 * Delete product
 */
router.delete('/{id}', async (req, res) => {
	await productService.delete(req.params.id);

	return res(null, { statusCode: 204 });
});

module.exports = router;
