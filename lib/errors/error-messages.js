/* eslint-disable class-methods-use-this */
/**
 * Throw default errors with default messages for common errors
 */
const { NotFoundError } = require('./errors');

module.export = class ErrorMessages {
	notFoundResource() {
		throw new NotFoundError('resource not found');
	}
};
