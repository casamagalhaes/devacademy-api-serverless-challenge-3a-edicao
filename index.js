const serverlessExpress = require('@vendia/serverless-express');
const app = require('./app');

module.exports.exports.handler = serverlessExpress({ app });
