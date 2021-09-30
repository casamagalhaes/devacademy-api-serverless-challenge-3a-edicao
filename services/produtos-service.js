/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
const { DataMapper } = require('@aws/dynamodb-data-mapper');
const { DynamoDB, Endpoint } = require('aws-sdk');
const { v4: uuid } = require('uuid');

const { Validate } = require('../lib/errors/validate');

const { ErrorMessages } = require('../lib/errors/error-messages');

const { Produto } = require('../models/Produto');

const { ENDPOINT } = process.env.DYNAMODB_ENDPOINT;

module.exports = class ProdutosService {
	constructor() {
		this.client = new DynamoDB(
			...(ENDPOINT && {
				endpoint: new Endpoint(ENDPOINT),
			})
		);

		this.mapper = new DataMapper({ client: this.client });

		this.Model = Produto;
	}

	async validateProd(produto) {
		Validate.isEmpty(produto.nome);
		Validate.isEmpty(produto.preco);
		Validate.isNonNegative(produto.preco);
	}

	async validateIdExists(id) {
		const idExists = await this.getById(id);

		if (!idExists) {
			ErrorMessages.notFoundResource();
		}
	}

	async save(item) {
		const itemInserted = await this.mapper.put(item, { onMissing: 'skip' });
		return itemInserted;
	}

	// GET All
	async getAll(filterName) {
		const produtos = [];

		const defaultCondition = {
			type: 'Function',
			name: 'attribute exists',
			subject: 'nome',
		};

		const scanFilter = {
			filter: {
				type: 'And',
				conditions: [filterName || defaultCondition],
			},
		};

		const iterator = this.mapper.scan(this.Model, scanFilter);

		for await (const produto of iterator) {
			produtos.push(produto);
		}

		return produtos;
	}

	// POST
	async post(item) {
		await this.validateProd(item);

		const modelProduto = new this.Model({ id: uuid(), ...item });

		await this.save(modelProduto);

		return modelProduto;
	}

	// PUT
	async put(id, body) {
		/* Validates before trying to insert */
		Validate.validateIds(id, body.id);
		await this.validateProd(body);
		await this.validateIdExists(id);

		const newProduto = new this.Model({ id, ...body });

		return this.saveItem(newProduto);
	}

	// DELETE
	async delete(id) {
		const produtoToDelete = await this.getById(id);

		if (!produtoToDelete) {
			ErrorMessages.notFoundResource();
		}

		return this.mapper.delete(produtoToDelete, { onMissing: 'skip' });
	}
};
