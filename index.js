const express = require('express');
const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config();

const { MONGO_CONNECTION_STR, PORT } = process.env;
const app = express();

const produtosRoute = require('./routes/router-produtos');

mongoose
	.connect(MONGO_CONNECTION_STR)
	.then(console.log('db connection successful'))
	.catch((err) => {
		console.log(`something went wrong on db connection : ${err}`);
	});

app.use(express.json());
app.use('/', produtosRoute);

// eslint-disable-next-line no-console
app.listen(PORT || 3000, () => console.log('server running on port 3000'));
