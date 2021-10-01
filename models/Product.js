const { DynamoDbSchema, DynamoDbTable } = require('@aws/dynamodb-data-mapper');

class product {
	get [DynamoDbTable]() {
		this.tableName = 'products';

		return this.tableName;
	}

	get [DynamoDbSchema]() {
		this.productSchema = {
			id: {
				type: 'String',
				keyType: 'HASH',
			},
			nome: { type: 'String' },
			price: { type: 'String' },
		};
		return this.productSchema;
	}
}

module.exports = product;
