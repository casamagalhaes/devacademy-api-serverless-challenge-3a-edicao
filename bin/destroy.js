const { destroy } = require('../database/db');

destroy().catch(console.error).finally(process.exit);
