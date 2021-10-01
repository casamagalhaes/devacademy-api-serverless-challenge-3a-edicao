const Router = require('../lib/router');

const router = new Router({ prefix: 'produtos' });

const ProductService = require('../services/product-service');

const productService = new ProductService();

/**
 * Get All products or product by name
 */
router.get('/products', async (req) => {
	const filterName = req.query.filter || null;

	const result = await productService.getAll(filterName);
	return result;
});

/**
 * Get product by Id
 */
router.get('/products/:id', async (req) => {
	const result = await productService.getById(req.params.id);

	return result;
});

/**
 * Insert product
 */
router.post('/products', async (req, res) => {
	const result = await productService.post(req.bodyParsed);

	return res(result, { statusCode: 201 });
});

/**
 * Update product
 */
router.put('/products/:id', async (req) => {
	const result = await productService.put(req.bodyParsed);
	return result;
});

/**
 * Delete product
 */
router.delete('/products/:id', async (req, res) => {
	await productService.delete(req.params.id);

	return res(null, { statusCode: 204 });
});

module.exports = router;
