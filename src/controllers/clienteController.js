const { v4: uuidv4 } = require('uuid');
const clienteRepository = require('../repositories/clienteRepository');
const Cliente = require('../models/clientes');

module.exports = {
  async index(req, res) {
    const cliente = await clienteRepository.findAll();
    if (!cliente) throw Error('Error');
    return res.status('200').json(cliente);
  },

  async findAllFilter(req, res) {
    const { name } = req.body;

    const data = await clienteRepository.findAllFilter(name);
    if (!data) throw Error('Error');
    return res.status('200').json(data);
  },

  async create(req, res) {
    const { name } = req.body;
    const cliente = new Cliente(uuidv4(), name);
    const newCliente = await clienteRepository.create(cliente);
    if (!newCliente) throw Error('Error');

    return res.status('200').json(newCliente);
  },

  async find(req, res) {
    const { id } = req.params;
    const cliente = await clienteRepository.find(id);
    if (!cliente) throw Error('Error');
    return res.status('200').json(cliente);
  },

  async update(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    const cliente = new Cliente(id, name);

    const clienteUpdate = await clienteRepository.update(id, cliente);
    if (!clienteUpdate) throw Error('Error');
    return res.status('200').json(cliente);
  },

  async delete(req, res) {
    const { id } = req.params;

    const clienteDelete = await clienteRepository.delete(id);
    if (!clienteDelete) throw Error('Error');
    return res.status('200').json(clienteDelete);
  }
};
