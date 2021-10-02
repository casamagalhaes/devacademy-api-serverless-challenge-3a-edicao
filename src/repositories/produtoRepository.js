const { v4: uuidv4 } = require('uuid');
const dynamoDB = require('../database/dynamo');

module.exports = Object.freeze({
  create: async (produto) => {
    const { name, price } = produto;
    const params = {
      TableName: 'workshop-products-joaquim',
      Item: {
        id: uuidv4(),
        name,
        price
      },
      ReturnValues: 'ALL_OLD'
    };

    try {
      const newProduct = await dynamoDB.put(params).promise();
      return newProduct;
    } catch (err) {
      console.log('Error', err);
      return false;
    }
  },

  findById: async (id) => {
    const params = {
      TableName: 'workshop-products-joaquim',

      Key: {
        id
      }
    };

    try {
      const produto = await dynamoDB.get(params).promise();
      return produto;
    } catch (err) {
      console.log('Error', err);
      return false;
    }
  },

  findAll: async () => {
    const params = {
      TableName: 'workshop-products-joaquim'
    };
    try {
      const produtos = await dynamoDB.scan(params).promise();
      return produtos;
    } catch (err) {
      console.log('Error', err);
      return false;
    }
  },

  findAllFilter: async (name) => {
    const nameProduto = name;
    const params = {
      TableName: 'workshop-products-joaquim',
      KeyConditionExpression: '#name = :value',
      ExpressionAttributeValues: { ':value': nameProduto }
    };

    try {
      const data = await dynamoDB.query(params).promise();
      return data;
    } catch (err) {
      return err;
    }
  },
  update: async (id, produto) => {
    const { name, price } = produto;
    const params = {
      TableName: 'workshop-products-joaquim',
      Key: {
        id
      },
      UpdateExpression: 'set name = :n, price = :p',
      ExpressionAttributeValues: {
        ':n': name,
        ':p': price
      },
      ReturnValues: 'UPDATED_NEW'
    };

    try {
      const updatePrduto = await dynamoDB.put(params).promise();
      return updatePrduto;
    } catch (err) {
      console.log('Error', err);
      return false;
    }
  },
  delete: async (id) => {
    const params = {
      TableName: 'workshop-products-joaquim',
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
