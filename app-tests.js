const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

app.listen(process.env.port, () => {
	console.log(`server running on port ${process.env.port}`);
});
