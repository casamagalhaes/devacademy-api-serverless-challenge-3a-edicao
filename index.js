const App = require('./lib/app');

const productsRoute = require('./routes/route-product');
const clientsRoute = require('./routes/route-client');

module.exports.handler = async (event) => {
	const app = new App(event);

	try {
		if (event.path.startsWith('/produtos')) {
			app.router(productsRoute);
		} else if (event.path.startsWith('/clientes')) {
			app.router(clientsRoute);
		}

		return await app.handler();
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e);

		return app.makeResponse({
			statusCode: 500,
			body: 'server error',
		});
	}
};
