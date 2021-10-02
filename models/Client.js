const { DynamoDbSchema, DynamoDbTable } = require('@aws/dynamodb-data-mapper');

class Client {
	constructor(options = {}) {
		Object.assign(this, options);
	}

	get [DynamoDbTable]() {
		this.tableName = process.env.CLIENTS_TABLE || 'clients';
		return this.tableName;
	}

	get [DynamoDbSchema]() {
		this.clientSchema = {
			id: {
				type: 'String',
				keyType: 'HASH',
			},
			name: { type: 'String' },
			email: { type: 'String' },
			password: { type: 'String' },
		};

		return this.clientSchema;
	}
}

module.exports = Client;
