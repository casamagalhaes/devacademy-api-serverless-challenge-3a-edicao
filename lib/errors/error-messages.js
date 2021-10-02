/* eslint-disable class-methods-use-this */
/**
 * Throw default errors with default messages for common errors
 */
const ValidationError = require('./validation-error');

module.exports = class ErrorMessages {
	static notFoundResource(resource) {
		throw new ValidationError(`${resource} not found`);
	}
};
