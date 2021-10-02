require('dotenv').config();
const { app } = require('./app');

const { logger } = require('./src/loaders/logger');

const SERVER_PORT = process.env.SERVER_PORT || 4000;

app.listen(SERVER_PORT, () => {
  logger.info(`App Running on Port ${SERVER_PORT}`);
});
