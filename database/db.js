/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { Endpoint } = require('aws-sdk');
const DynamoDB = require('aws-sdk/clients/dynamodb');

const { DYNAMODB_ENDPOINT } = process.env;

const dynamodb = new DynamoDB({
	...(DYNAMODB_ENDPOINT && { endpoint: new Endpoint(DYNAMODB_ENDPOINT) }),
});

/**
 * @param {*} tableName - name of table
 * @param {*} attrName - name of attribute
 * @returns - returns a DescribeTable with defined values for AttributeType, KeyType,
 * ReadCapacityUnits and WriteCapacityUnits.
 */
const describeTable = (tableName, attrName) => ({
	AttributeDefinitions: [{ AttributeName: attrName, AttributeType: 'S' }],
	KeySchema: [{ AttributeName: attrName, KeyType: 'HASH' }],
	ProvisionedThroughput: {
		ReadCapacityUnits: 100,
		WriteCapacityUnits: 100,
	},
	TableName: tableName,
});

const tables = [
	describeTable('produtos', 'id'),
	describeTable('clientes', 'id'),
];

/**
 * Checks if a table already exists
 * @returns true if the table exists,
 * otherwise returns false
 */
const tableExists = async (TableName) => {
	try {
		await dynamodb.describeTable({ TableName }).promise();
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
