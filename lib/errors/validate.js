const ValidationError = require('./validation-error');
const NotFoundError = require('./not-found-error');

/* eslint-disable class-methods-use-this */
class Validate {
	static isEmpty(str, field) {
		if (!str) {
			throw new ValidationError(`${field} is required`);
		}
	}

	static isNonNegative(number, field) {
		if (number < 0) {
			throw new ValidationError(`${field} must be greater than 0`);
		}
	}

	static validateIds(resourceId, bodyId) {
		if (resourceId !== bodyId) {
			throw new ValidationError('Resource Id is different from body id');
		}
	}

	static notFoundResource(exists) {
		if (!exists) {
			throw new NotFoundError('Resource not found');
		}
	}
}

module.exports = Validate;
