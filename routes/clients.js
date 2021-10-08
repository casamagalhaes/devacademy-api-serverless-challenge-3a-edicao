const Router = require('./../lib/router');
const ClientService = require('../services/client-service');
const clientService = new ClientService();

const router = new Router({ prefix: 'clients' });

router.get('/', async () => {
  const data = await clientService.findAll();
  return data;
});

router.post('/', async (req, res) => {
  const data = await clientService.create(req.bodyParsed);
  return res(data, { statusCode: 201 });
});

router.get('/{id}', async (req) => {
  const data = await clientService.findById(req.params.id);
  return data;
});

router.put('/{id}', async (req) => {
  const data = await clientService.update(req.params.id, req.bodyParsed);
  return data;
});

router.delete('/{id}', async (req, res) => {
  await clientService.delete(req.params.id);
  return res(null, { statusCode: 204 });
});

module.exports = router;
