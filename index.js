const express = require('express');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const { MONGO_CONNECTION_STR, PORT } = process.env;
const app = express();

mongoose
	.connect(MONGO_CONNECTION_STR)
	.then(console.log('db connection successful'))
	.catch((err) => {
		console.log(`something went wrong on db connection : ${err}`);
	});

// eslint-disable-next-line no-console
app.listen(PORT || 3000, () => console.log('server running on port 3000'));
