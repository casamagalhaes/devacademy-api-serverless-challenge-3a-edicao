const { DynamoDbSchema, DynamoDbTable } = require('@aws/dynamodb-data-mapper');

class Produto {
	get [DynamoDbTable]() {
		this.tableName = 'produtos';

		return this.tableName;
	}

	get [DynamoDbSchema]() {
		this.produtoSchema = {
			id: {
				type: 'String',
				keyType: 'HASH',
			},
			nome: { type: 'String' },
			preco: { type: 'String' },
		};
		return this.produtoSchema;
	}
}

module.exports = Produto;
