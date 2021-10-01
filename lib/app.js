/* eslint-disable no-console */
const { ApiError } = require('./errors/api-error');
/* eslint-disable class-methods-use-this */
module.exports = class App {
	constructor(event) {
		this.event = event;
	}

	router(router) {
		this.router = router;
	}

	get request() {
		const { event } = this;

		const { httpMethod, isBase64Encoded, headers } = event;

		const extractRawBody = (body) => {
			if (!body) {
				return Buffer.from('');
			}

			return Buffer.from(body, isBase64Encoded ? 'base64' : 'utf8');
		};

		const parserBody = (body) => {
			const content = body.toString('utf8');

			return content ? JSON.parser(content) : content;
		};

		const rawBody = extractRawBody(event.body);
		const bodyParsed = parserBody(rawBody);

		return {
			method: httpMethod,
			path: event.path,
			body: rawBody,
			bodyParsed,
			queryStringParams: event.queryStringParams,
			headers,
		};
	}

	async handler() {
		try {
			const { router, request } = this;
			const matched = router.matchRoute(request.method, request.path);

			if (!matched) {
				return this.makeResponse({
					statusCode: 404,
					body: 'Recurso não localizado',
				});
			}

			const { handler, params } = matched;

			const { bodyParsed } = request;

			let response = null;

			const responseFn = (data, { statusCode, headers }) => {
				response = this.makeResponse({
					body: data,
					statusCode: statusCode || 200,
					headers,
				});
			};

			const data = await handler({ params, bodyParsed }, responseFn);

			return response || this.makeResponse({ body: data });
		} catch (e) {
			console.log(e);
			console.log(e.stack);
			return this.makeResponseError(e);
		}
	}

	makeResponse({ statusCode, body, headers, isBase64Encoded } = {}) {
		return {
			statusCode: statusCode || 200,
			headers: { 'content-type': 'application/json', ...(headers || {}) },
			isBase64Encoded,
			body: isBase64Encoded ? body : JSON.stringify(body),
		};
	}

	makeResponseError(error) {
		if (error instanceof ApiError) {
			return this.makeResponse({
				statusCode: error.statusCode,
				body: error.message,
			});
		}

		return this.makeResponse({ statusCode: 500, body: 'server error' });
	}
};
