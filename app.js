const express = require('express');

const app = express();
const awsServelessExpressMiddleware = require('aws-serverless-express/middleware');

const bodyParser = require('body-parser');
const cors = require('cors');

const routeClientes = require('./routes/router-clientes');
const routeProdutos = require('./routes/router-produtos');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServelessExpressMiddleware.eventContext());
app.use('/', routeClientes);
app.use('/', routeProdutos);

module.exports = app;
