const { DynamoDbSchema, DynamoDbTable } = require('@aws/dynamodb-data-mapper');

class Product {
	constructor(options = {}) {
		Object.assign(this, options);
	}

	get [DynamoDbTable]() {
		this.tableName = process.env.PRODUCTS_TABLE || 'products';

		return this.tableName;
	}

	get [DynamoDbSchema]() {
		this.productSchema = {
			id: {
				type: 'String',
				keyType: 'HASH',
			},
			name: { type: 'String' },
			price: { type: 'Number' },
		};
		return this.productSchema;
	}
}

module.exports = Product;
