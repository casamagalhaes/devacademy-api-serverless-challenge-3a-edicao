/* eslint-disable no-console */
const { dropDB } = require('../database/db');

dropDB().catch(console.error).finally(process.exit);
