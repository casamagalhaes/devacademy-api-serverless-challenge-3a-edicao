/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const { Endpoint } = require('aws-sdk');
const DynamoDB = require('aws-sdk/clients/dynamodb');

const dynamodb = new DynamoDB(new Endpoint(process.env.DYNAMODB_ENDPOINT));

const getTableConfig = (tableName, attrName) => ({
	TableName: tableName,
	KeySchema: [{ AttributeName: attrName, KeyType: 'HASH' }],
	AttributeDefinitions: [{ AttributeName: attrName, AttributeType: 'S' }],
	ProvisionedThroughput: {
		ReadCapacityUnits: 100,
		WriteCapacityUnits: 100,
	},
});

const tables = [
	getTableConfig('produtos', 'id'),
	getTableConfig('clientes', 'id'),
];

/* Checks if a table already exists */
const tableExists = async (name) => {
	try {
		await dynamodb.describeTable({ TableName: name }).promise();
		return true;
	} catch (e) {
		if (e.code !== 'ResourceNotFoundException') {
			throw e;
		}
		return false;
	}
};

const createDB = async () => {
	for (const table of tables) {
		const exists = await tableExists(table.TableName);

		/* Before creating a new table, checks if table already exists */
		if (!exists) {
			await dynamodb.createTable(table).promise();
		}

		console.log('db created');
	}
};

const dropDB = async () => {
	for (const table of tables) {
		const name = table.TableName;
		const exists = await tableExists(name);

		if (exists) {
			await dynamodb.deleteTable({ TableName: name }).promise();
		}
	}

	console.log('db dropped');
};

const resetDB = async () => {
	await dropDB();
	await createDB();
};

module.exports = { createDB, dropDB, resetDB };
