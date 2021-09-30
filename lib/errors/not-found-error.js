const { ApiError } = require('./api-error');

module.exports = class NotFoundError extends ApiError {
	constructor(msg) {
		super(msg);
		this.code = 'NOT_FOUND';
		this.statusCode = 404;
	}
};
