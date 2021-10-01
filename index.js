const App = require('./lib/app');

const productsRouter = require('./routes/router-products');
const clientsRouter = require('./routes/router-clients');

module.exports.handler = async (event) => {
	const app = new App(event);

	try {
		if (event.path === '/produtos') {
			app.router(productsRouter);
		} else if (event.path === '/clientes') {
			app.router(clientsRouter);
		}

		return await app.handler();
	} catch (e) {
		console.error(e);

		return app.makeResponse({
			statusCode: 500,
			body: 'server error',
		});
	}
};
