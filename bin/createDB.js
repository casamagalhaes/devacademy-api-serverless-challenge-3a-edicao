/* eslint-disable no-console */
const { createDB } = require('../database/db');

createDB().catch(console.error).finally(process.exit);
