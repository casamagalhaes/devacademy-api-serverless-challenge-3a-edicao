const { v4: uuid } = require('uuid');
const { DataMapper } = require('@aws/dynamodb-data-mapper');
const { Endpoint } = require('aws-sdk');
const DynamoDB = require('aws-sdk/clients/dynamodb');
const Client = require('../models/client');
const { ValidationError, NotFoundError } = require('../lib/errors');

const { DYNAMODB_ENDPOINT } = process.env;

module.exports = class ClientService {
  constructor() {
    this._client = new DynamoDB({
      ...(DYNAMODB_ENDPOINT && {
        endpoint: new Endpoint(process.env.DYNAMODB_ENDPOINT),
      }),
    });
    this._mapper = new DataMapper({ client: this._client });
    this._modelClass = Client;
  }

  async validateBeforeSave(client) {
    if (!client.name) throw new ValidationError('name is required');
    if (!client.cpf) throw new ValidationError('cpf is required');
  }

  async save(instance) {
    return await this._mapper.put(instance, { onMissing: 'skip' });
  }

  async create(data) {
    await this.validateBeforeSave(data);
    const client = new this._modelClass({ id: uuid(), ...data });
    await this.save(client);
    return client;
  }

  async validateExists(id) {
    const exists = await this.findById(id);
    if (!exists) throw new NotFoundError('client not found');
  }

  async update(id, data) {
    if (id !== data.id)
    throw new ValidationError('resource id is different from the body id');
    await this.validateBeforeSave(data);
    await this.validateExists(id);
    const client = new this._modelClass({ id, ...data });
    return this.save(client);
  }

  async patch(id, data) {
    await this.validateExists(id);
    const client = await this.findById(id);
    Object.assign(client, { id, ...data });
    return this.save(client);
  }

  async findAll(filter) {
    const clients = [];
    const scanFilter = {
      filter: {
        type: 'And',
        conditions: [
          filter || {
            type: 'Function',
            name: 'attribute_exists',
            subject: 'id',
          },
        ],
      },
    };
    const iterator = this._mapper.scan(this._modelClass, scanFilter);
    for await (const product of iterator) clients.push(product);
    return clients;
  }

  async findById(id) {
    try {
      const client = await this._mapper.get(new this._modelClass({ id }));
      if (!client.deletedAt) return client;
    } catch (e) {
      if (e.name === 'ItemNotFoundException')
        throw new NotFoundError('client not found');
      throw e;
    }
  }

  async delete(id) {
    const client = await this.findById(id);
    if (!client) throw new NotFoundError('client not found');
    return this._mapper.delete(client, { onMissing: 'skip' });
  }
};
