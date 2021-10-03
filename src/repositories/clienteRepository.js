const dynamoDB = require('../database/dynamo');

module.exports = Object.freeze({
  create: async (cliente) => {
    const params = {
      TableName: 'workshop-customer-joaquim',
      Item: cliente,
      ReturnValues: 'ALL_OLD'
    };

    try {
      const newCliente = await dynamoDB.put(params).promise();
      return newCliente;
    } catch (err) {
      console.log('Error', err);
      return false;
    }
  },

  findById: async (id) => {
    const params = {
      TableName: 'workshop-customer-joaquim',
      Key: {
        id
      }
    };

    try {
      const cliente = await dynamoDB.get(params).promise();
      return cliente;
    } catch (err) {
      console.log('Error', err);
      return false;
    }
  },

  findAll: async () => {
    const params = {
      TableName: 'workshop-customer-joaquim'
    };
    try {
      const clientes = await dynamoDB.scan(params).promise();
      return clientes;
    } catch (err) {
      return err;
    }
  },

  findAllFilter: async (name) => {
    const nameCliente = name;
    const params = {
      TableName: 'workshop-customer-joaquim',
      KeyConditionExpression: '#name = :value',
      ExpressionAttributeValues: { ':value': nameCliente }
    };

    try {
      const data = await dynamoDB.query(params).promise();
      return data;
    } catch (err) {
      console.log('Error', err);
      return false;
    }
  },
  update: async (id, cliente) => {
    const { name } = cliente;
    const params = {
      TableName: 'workshop-customer-joaquim',
      Key: {
        id
      },
      UpdateExpression: 'set name = :n',
      ExpressionAttributeValues: {
        ':n': name
      },
      ReturnValues: 'UPDATED_NEW'
    };

    try {
      const updateCliente = await dynamoDB.put(params).promise();
      return updateCliente;
    } catch (err) {
      console.log('Error', err);
      return false;
    }
  },
  delete: async (id) => {
    const params = {
      TableName: 'workshop-customer-joaquim',
      Key: {
        id
      }
    };

    try {
      await dynamoDB.delete(params).promise();
      return true;
    } catch (err) {
      console.log('Error', err);
      return false;
    }
  }
});
