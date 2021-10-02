/* eslint-disable no-console */
const { resetDB } = require('../database/db');

resetDB().catch(console.error).finally(process.exit);
