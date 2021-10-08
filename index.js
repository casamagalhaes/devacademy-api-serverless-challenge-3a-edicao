const App = require('./lib/app');
const productsRouter = require('./routes/products');
const clientsRouter = require('./routes/clients');
const Router = require('./lib/router')

const router = new Router();

module.exports.handler = async (event) => {
  const app = new App(event);

  try {
    router.merge(clientsRouter)
    router.merge(productsRouter)

    app.router(router);
    return await app.handler();
  } catch (error) {
    console.error(error);
    return app.makeResponse({
      statusCode: 500,
      body: 'server error',
    });
  }
};
