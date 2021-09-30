const { create } = require('../database/db');

create().catch(console.error).finally(process.exit);
