/* eslint-disable new-cap */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
const { DataMapper } = require('@aws/dynamodb-data-mapper');
const { Endpoint } = require('aws-sdk');
const { v4: uuid } = require('uuid');

const DynamoDB = require('aws-sdk/clients/dynamodb');
const Validate = require('../lib/errors/validate');
const ErrorMessages = require('../lib/errors/error-messages');
const Product = require('../models/Product');
const Helpers = require('./helpers');

const { DYNAMODB_ENDPOINT } = process.env;

module.exports = class productService {
	constructor() {
		this.client = new DynamoDB({
			...(DYNAMODB_ENDPOINT && {
				endpoint: new Endpoint(process.env.DYNAMODB_ENDPOINT),
			}),
		});

		this.mapper = new DataMapper({ client: this.client });
		this.model = Product;
	}

	async validateProd(product) {
		Validate.isEmpty(product.name, 'name');
		Validate.isEmpty(product.price, 'price');
		Validate.isNonNegative(product.price, 'price');
	}

	async validateIdExists(id) {
		const idExists = await this.getById(id);

		if (!idExists) {
			ErrorMessages.notFoundResource('id');
		}
	}

	async save(item) {
		const itemInserted = await this.mapper.put(item, { onMissing: 'skip' });

		return itemInserted;
	}

	// GET All
	async getAll(filterName) {
		let products = [];

		const scanFilter = {
			filter: {
				type: 'And',
				conditions: [
					{
						type: 'Function',
						name: 'attribute_exists',
						subject: 'id',
					},
				],
			},
		};

		const iterator = this.mapper.scan(this.model, scanFilter);

		for await (const product of iterator) {
			products.push(product);
		}

		if (filterName) {
			const filteredArray = Helpers.filterItemsByName(filterName, products);
			products = filteredArray;
		}

		return products;
	}

	// GET BY ID
	async getById(id) {
		let product = {};
		try {
			product = await this.mapper.get(new this.model({ id }));

			if (!product.deletedAt) {
				return product;
			}
		} catch (e) {
			if (e.name === 'ItemNotFoundException') {
				ErrorMessages.notFoundResource('id');
			}

			throw e;
		}
		return product;
	}

	// POST
	async post(item) {
		await this.validateProd(item);

		const modelProduct = new this.model({ id: uuid(), ...item });

		await this.save(modelProduct);

		return modelProduct;
	}

	// PUT
	async put(id, body) {
		/* Validates before trying to update */
		Validate.validateIds(id, body.id);
		await this.validateProd(body);
		await this.validateIdExists(id);

		const newProduct = new this.model({ id, ...body });

		return this.save(newProduct);
	}

	// DELETE BY ID
	async deleteById(id) {
		const productToDelete = await this.getById(id);

		if (!productToDelete) {
			ErrorMessages.notFoundResource('id');
		}

		return this.mapper.delete(productToDelete, { onMissing: 'skip' });
	}
};
