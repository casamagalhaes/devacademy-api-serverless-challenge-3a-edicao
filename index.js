const App = require('./lib/app');

const productsRouter = require('./routes/router-products');

module.exports.handler = async (event) => {
	const app = new App(event);

	try {
		app.router(productsRouter);

		return await app.handler();
	} catch (e) {
		console.error(e);

		return app.makeResponse({
			statusCode: 500,
			body: 'server error',
		});
	}
};
