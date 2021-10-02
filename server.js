/* eslint-disable no-restricted-syntax */
const http = require('http');
const URL = require('url');
const queryString = require('querystring');
const { handler } = require('./index');

const PORT = 3000;

const getBody = async (req) => {
	const body = [];

	for await (const chunk of req) {
		body.push(chunk);
	}

	return Buffer.concat(body).toString();
};

const eventRequestGenerator = (httpMethod, path, body, headers) => {
	const parsedPath = URL.parse(path);

	const queryStringParams = queryString.parse(parsedPath.query);

	return {
		httpMethod,
		path: parsedPath.pathname,
		queryStringParams,
		requestContext: {
			elb: {
				targetGroupArn:
					'arn:aws:elasticloadbalancing:us-east-1:901194531837:targetgroup/panamah-dashboard-hom-target-gp/2c6ab79f901cf5fb',
			},
		},
		headers: {
			accept: '*/*',
			'accept-encoding': 'gzip, deflate, br',
			'accept-language': 'en-US,en;q=0.9',
			'access-control-request-headers': 'authorization',
			'access-control-request-method': 'GET',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'cross-site',
			'x-amzn-trace-id': 'Root=1-5df50966-fcef36da4eaf8f4abedb80ea',
			'x-forwarded-for': '191.6.8.217',
			'x-forwarded-port': '443',
			'x-forwarded-proto': 'https',
			...(headers || {}),
		},
		body: body || 'null',
		isBase64Encoded: false,
	};
};

const server = http.createServer(async (req, res) => {
	const { method, url, headers } = req;

	const body = await getBody(req);

	const event = eventRequestGenerator(method, url, body, headers);

	const response = await handler(event, {});

	res.writeHead(response.statusCode, response.headers);

	if (response.isBase64Encoded) {
		res.end(Buffer.from(response.body, 'base64'));
	} else {
		res.end(response.body);
	}
});

server.listen(PORT, () => {
	console.log(`endpoint para testes foi inicializado na porta ${PORT}`);
});
