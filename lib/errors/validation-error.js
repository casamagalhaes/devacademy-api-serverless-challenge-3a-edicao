const { ApiError } = require('./api-error');

module.exports = class ValidationError extends ApiError {
	constructor(msg) {
		super(msg);
		this.code = 'VALIDATION_ERROR';
		this.statusCode = 422;
	}
};
