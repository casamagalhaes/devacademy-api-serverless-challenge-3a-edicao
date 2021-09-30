const ValidationError = require('./validation-error');
const NotFoundError = require('./not-found-error');

/* eslint-disable class-methods-use-this */
module.export = class Validate {
	isEmpty(str) {
		if (!str) {
			throw new ValidationError('required field');
		}
	}

	isNonNegative(number) {
		if (number < 0) {
			throw new ValidationError("this field don't accept 0 or negative values");
		}
	}

	validateIds(resourceId, bodyId) {
		if (resourceId !== bodyId) {
			throw new ValidationError('Resource Id is different from body id');
		}
	}

	notFoundResource(exists) {
		if (!exists) {
			throw new NotFoundError('resource not found');
		}
	}
};
