const { DynamoDbSchema, DynamoDbTable } = require('@aws/dynamodb-data-mapper');

class Clients {
  constructor(opts = {}) {
    Object.assign(this, opts);
  }

  get [DynamoDbTable]() {
    return process.env.CLIENTS_TABLE || 'workshop-clients-matheus';
  }

  get [DynamoDbSchema]() {
    return {
      id: {
        type: 'String',
        keyType: 'HASH',
      },
      name: { type: 'String' },
      cpf: { type: 'String' },
    };
  }
}

module.exports = Clients;
