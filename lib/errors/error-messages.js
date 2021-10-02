/* eslint-disable class-methods-use-this */
/**
 * Throw default errors with default messages for common errors
 */
const { NotFoundError } = require('./errors');

module.exports = class ErrorMessages {
	static notFoundResource() {
		throw new NotFoundError('Resource not found');
	}
};
