/* eslint-disable new-cap */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
const { DataMapper } = require('@aws/dynamodb-data-mapper');
const { Endpoint } = require('aws-sdk');
const { v4: uuid } = require('uuid');

const DynamoDB = require('aws-sdk/clients/dynamodb');
const Validate = require('../lib/errors/validate');
const ErrorMessages = require('../lib/errors/error-messages');
const Client = require('../models/Client');
const Helpers = require('./helpers');

const { DYNAMODB_ENDPOINT } = process.env;
module.exports = class clientService {
	constructor() {
		this.client = new DynamoDB({
			...(DYNAMODB_ENDPOINT && {
				endpoint: new Endpoint(DYNAMODB_ENDPOINT),
			}),
		});

		this.mapper = new DataMapper({ client: this.client });

		this.Model = Client;
	}

	async validateClient(client) {
		Validate.isEmpty(client.name, 'name');
		Validate.isEmpty(client.email, 'email');
		Validate.isEmpty(client.password, 'password');
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

	// GET ALL
	async getAll(filterName) {
		let clients = [];

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

		const iterator = this.mapper.scan(this.Model, scanFilter);

		for await (const client of iterator) {
			clients.push(client);
		}

		if (filterName) {
			const filteredArray = Helpers.filterItemsByName(filterName, clients);
			clients = filteredArray;
		}

		return clients;
	}

	// GET BY ID
	async getById(id) {
		let client = null;
		try {
			client = await this.mapper.get(new this.Model({ id }));

			if (!client.deletedAt) {
				return client;
			}
		} catch (e) {
			if (e.name === 'ItemNotFoundException') {
				ErrorMessages.notFoundResource();
			}

			throw e;
		}
		return client;
	}

	// POST
	async post(item) {
		await this.validateClient(item);

		const modelClient = new this.Model({ id: uuid(), ...item });

		await this.save(modelClient);

		return modelClient;
	}

	// PUT
	async put(id, body) {
		/* Validates before trying to update */
		Validate.validateIds(id, body.id);
		await this.validateClient(body);
		await this.validateIdExists(id);

		const newClient = new this.Model({ id, ...body });

		return this.save(newClient);
	}

	// DELETE
	async delete(id) {
		const clientToDelete = await this.getById(id);

		/* Client doesn't exist */
		if (!clientToDelete) {
			ErrorMessages.notFoundResource('id');
		}

		return this.mapper.delete(clientToDelete, { onMissing: 'skip' });
	}
};
