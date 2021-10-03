const { v4: uuidv4 } = require('uuid');
const produtoRepository = require('../repositories/produtoRepository');
const Produto = require('../models/produtos');

module.exports = {
  async index(req, res) {
    const produtos = await produtoRepository.findAll();
    if (!produtos) throw Error('Error');
    return res.status('200').json(produtos);
  },

  async create(req, res) {
    const { name, price } = req.body;
    const product = new Produto(uuidv4(), name, price);
    const newProduct = await produtoRepository.create(product);
    if (!newProduct) throw Error('Error');
    return res.status('200').json(newProduct);
  },

  async find(req, res) {
    const { id } = req.params;

    const product = await produtoRepository.findById(id);
    if (!product) throw Error('Error');
    return res.status('200').json(product);
  },

  async findAllFilter(req, res) {
    const { name } = req.body;
    const data = await produtoRepository.findAllFilterd(name);
    if (!data) throw Error('Error');
    return res.status('200').json(data);
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, price } = req.body;
    const product = new Produto(id, name, price);

    const productUpdate = await produtoRepository.update(id, product);
    if (!productUpdate) throw Error('Error');
    return res.status('200').json(productUpdate);
  },

  async delete(req, res) {
    const { id } = req.params;

    const productDelete = await produtoRepository.delete(id);
    if (!productDelete) throw Error('Error');
    return res.status('200').json(productDelete);
  }
};
