/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
const { DataMapper } = require('@aws/dynamodb-data-mapper');
const { DynamoDB, Endpoint } = require('aws-sdk');
const { v4: uuid } = require('uuid');

const { Validate } = require('../lib/errors/validate');

const { ErrorMessages } = require('../lib/errors/error-messages');

const { Cliente } = require('../models/Cliente');

const { ENDPOINT } = process.env.DYNAMODB_ENDPOINT;

module.exports = class ProdutosService {
	constructor() {
		this.client = new DynamoDB(
			...(ENDPOINT && {
				endpoint: new Endpoint(ENDPOINT),
			})
		);

		this.mapper = new DataMapper({ client: this.client });

		this.Model = Cliente;
	}

	async validateCliente(cliente) {
		Validate.isEmpty(cliente.nome);
		Validate.isEmpty(cliente.preco);
		Validate.isNonNegative(cliente.preco);
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
		const clientes = [];

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

		for await (const cliente of iterator) {
			clientes.push(cliente);
		}

		return clientes;
	}

	// GET By Id
	async getById(id) {
		let cliente = {};
		try {
			cliente = await this.mapper.get(new this.Model({ id }));

			if (!cliente.deletedAt) {
				return cliente;
			}
		} catch (e) {
			if (e.name === 'ItemNotFoundException') {
				ErrorMessages.notFoundResource();
			}

			throw e;
		}
		return cliente;
	}

	// POST
	async post(item) {
		await this.validateProd(item);

		const modelCliente = new this.Model({ id: uuid(), ...item });

		await this.save(modelCliente);

		return modelCliente;
	}

	// PUT
	async put(id, body) {
		/* Validates before trying to insert */
		Validate.validateIds(id, body.id);
		await this.validateCliente(body);
		await this.validateIdExists(id);

		const newCliente = new this.Model({ id, ...body });

		return this.saveItem(newCliente);
	}

	// DELETE
	async delete(id) {
		const clienteToDelete = await this.getById(id);

		if (!clienteToDelete) {
			ErrorMessages.notFoundResource();
		}

		return this.mapper.delete(clienteToDelete, { onMissing: 'skip' });
	}
};
