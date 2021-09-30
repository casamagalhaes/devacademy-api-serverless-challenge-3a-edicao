const { DynamoDbSchema, DynamoDbTable } = require('@aws/dynamodb-data-mapper');

class Cliente {
	get [DynamoDbTable]() {
		this.tableName = 'clientes';
		return this.tableName;
	}

	get [DynamoDbSchema]() {
		this.clienteSchema = {
			id: {
				type: 'String',
				keyType: 'HASH',
			},
			nome: { type: 'String' },
			email: { type: 'String' },
			password: { type: 'String' },
		};

		return this.clienteSchema;
	}
}

module.exports = Cliente;
