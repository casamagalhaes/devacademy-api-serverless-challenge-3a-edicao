const { reset } = require('../database/db');

reset().catch(console.error).finally(process.exit);
