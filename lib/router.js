/* eslint-disable class-methods-use-this */
const kRoutes = Symbol('routes');
const kPrefix = Symbol('prefix');

module.exports = class Router {
	constructor({ prefix } = {}) {
		this[kRoutes] = {};
		this[kPrefix] = prefix || '';
	}

	get routes() {
		return this[kRoutes];
	}

	get prefix() {
		const prefix = (this[kPrefix] || '').trim();

		if (!prefix) {
			return '';
		}

		return prefix.startsWith('/') ? prefix : `/${prefix}`;
	}

	normalizePath(path) {
		const trimed = `${this.prefix}${path.trim()}`;

		if (trimed.endsWith('/') && trimed.length > 1) {
			return trimed.substring(0, trimed.length - 1);
		}

		return trimed;
	}

	register(resource, method, action) {
		if (typeof action !== 'function')
			throw new Error('Callback da rota deve ser uma função');

		const path = this.normalizePath(resource);
		const routes = this[kRoutes][path] || {};

		routes[method] = action;

		this[kRoutes][path] = routes;
	}

	get(resource, action) {
		this.register(resource, 'GET', action);
	}

	post(resource, action) {
		this.register(resource, 'POST', action);
	}

	put(resource, action) {
		this.register(resource, 'PUT', action);
	}

	delete(resource, action) {
		this.register(resource, 'DELETE', action);
	}

	merge(otherRouter) {
		if (!(otherRouter instanceof Router)) {
			throw new Error('router deve ser uma instância de Router');
		}

		const { routes } = otherRouter;

		Object.keys(routes).forEach((path) => {
			const methods = routes[path];
			Object.keys(methods).forEach((method) => {
				this.register(path, method.toUpperCase(), methods[method]);
			});
		});
	}

	compilePath(path) {
		const pathReplace = path.replace(/{(.*?)}/gi, '(?<$1>[^/]+?)');
		const regex = `^${pathReplace}(?:/)?$`;
		return new RegExp(regex);
	}

	matchPath(pathname, query) {
		const { routes } = this;

		const paths = Object.keys(routes);

		return paths
			.map((path) => {
				const regexp = this.compilePath(path);
				const match = regexp.exec(pathname);

				if (!match) return null;

				const [url] = match;

				const params = Object.keys(match.groups || {}).reduce((acc, key) => {
					acc[key] = match.groups[key];
					return acc;
				}, {});

				return {
					resource: path,
					url,
					params,
					query,
				};
			})
			.filter((matched) => matched)
			.shift();
	}

	matchRoute(method, url, query) {
		const matched = this.matchPath(url, query);

		if (!matched) return null;

		const { routes } = this;
		const { resource } = matched;

		const methods = routes[resource];
		const handler = methods[method];

		if (!handler) return null;

		return {
			handler,
			...matched,
		};
	}
};
