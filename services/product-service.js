/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
const { DataMapper } = require('@aws/dynamodb-data-mapper');
const { Endpoint } = require('aws-sdk');
const { v4: uuid } = require('uuid');

const DynamoDB = require('aws-sdk/clients/dynamodb');

const { Validate } = require('../lib/errors/validate');
const { ErrorMessages } = require('../lib/errors/error-messages');
const { Product } = require('../models/Product');

const { DYNAMODB_ENDPOINT } = process.env;

module.exports = class productService {
	constructor() {
		this.client = new DynamoDB({
			...(DYNAMODB_ENDPOINT && {
				endpoint: new Endpoint(DYNAMODB_ENDPOINT),
			}),
		});

		this.mapper = new DataMapper({ client: this.client });

		this.Model = Product;
	}

	async validateProd(product) {
		Validate.isEmpty(product.nome);
		Validate.isEmpty(product.price);
		Validate.isNonNegative(product.price);
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
		const products = [];

		const defaultCondition = {
			type: 'Function',
			subject: 'nome',
			name: 'attribute exists',
		};

		const scanFilter = {
			filter: {
				type: 'And',
				conditions: [filterName || defaultCondition],
			},
		};

		const iterator = this.mapper.scan(this.Model, scanFilter);

		for await (const product of iterator) {
			products.push(product);
		}

		return products;
	}

	// GET By Id
	async getById(id) {
		let product = {};
		try {
			product = await this.mapper.get(new this.Model({ id }));

			if (!product.deletedAt) {
				return product;
			}
		} catch (e) {
			if (e.name === 'ItemNotFoundException') {
				ErrorMessages.notFoundResource();
			}

			throw e;
		}
		return product;
	}

	// POST
	async post(item) {
		await this.validateProd(item);

		const modelProduct = new this.Model({ id: uuid(), ...item });

		await this.save(modelProduct);

		return modelProduct;
	}

	// PUT
	async put(id, body) {
		/* Validates before trying to insert */
		Validate.validateIds(id, body.id);
		await this.validateProd(body);
		await this.validateIdExists(id);

		const newProduct = new this.Model({ id, ...body });

		return this.saveItem(newProduct);
	}

	// DELETE
	async delete(id) {
		const productToDelete = await this.getById(id);

		if (!productToDelete) {
			ErrorMessages.notFoundResource();
		}

		return this.mapper.delete(productToDelete, { onMissing: 'skip' });
	}
};
