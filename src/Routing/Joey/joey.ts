import { Res } from '../Res';
import { Router } from '../Router';
import { Responder } from '../Responder';
import { AuthData, AuthHandler, Context, Handler, Method, Register, Req, ResolvedHandler } from './joey.types';
import { Status } from '../../Utilities/general/statuses';

const error = (status: Status) => new Res().error(status);

export class Joey {
	protected req: Req = new Request('');
	protected res: Res = new Res();
	protected defaultHandler: Handler = () => error(400);
	protected register: Register = { paths: {}, routers: {} };
	protected authHandler: AuthHandler = () => null;
	protected authData: AuthData = null;

	constructor() {
		addEventListener('fetch', (event: FetchEvent): void => {
			// First set the request and initialise a new Req
			this.req = event.request;
			this.res = new Res();

			// Then find the correct handler and context
			const { handler, authenticate, context } = this.resolveHandler(event, this.res);

			// Next check if the request endpoint requires auth, and is so, do the auth
			if (authenticate && !(context as Joey).authenticated())
				return event.respondWith(new Responder(error(401)).send());

			event.respondWith(this.handleResponse(handler));
		});
	}

	/** Resolving methods */
	/** Resolver
	 * This method finds the handler, first checking an exact path, then the routers
	 * */
	protected resolveHandler(event: FetchEvent, res: Res, reducer: string = ''): ResolvedHandler {
		const method = event.request.method as Method;
		const { url } = event.request;
		const route = new URL(url).pathname;

		const reducedName = this.getRegisteredName(route.slice(reducer.length));
		const exactPathMatch = this.matchRoute(reducedName);

		/** 1. Look for the exact path and method */
		if (exactPathMatch && this.register.paths[exactPathMatch][method]) {
			return this.register.paths[exactPathMatch][method] as ResolvedHandler;
		}

		/** 2. See if there is a valid router */
		if (reducedName !== '__base_route') {
			let name = reducedName;

			while (name.length > 0) {
				const matchedRouter = this.matchRoute(name, true);

				if (matchedRouter && this.register.routers[matchedRouter]) {
					return this.register.routers[matchedRouter].resolveHandler(event, res, reducer + name);
				}

				const dirs = name.split('/');
				name = name.slice(0, -1 - dirs[dirs.length - 1].length);
			}
		}

		/** 3. Check if there is a valid path but wrong method  */
		/** THIS IS THE WRONG USAGE OF METHOD NOT ALLOWED ACTUALLY. I THINK IT SHOULD BE BASED ON IF CORS POLICY DENY A PARTICULAR METHOD */
		if (exactPathMatch) {
			return { handler: () => error(403), authenticate: false, context: this };
		}

		/** 4. Return the default */
		return {
			handler: this.defaultHandler,
			authenticate: false,
			context: this
		};
	}

	protected matchRoute(route: string, router: boolean = false) {
		return Object.keys(this.register[router ? 'routers' : 'paths']).find(path => {
			const regex = path.replace(/:[^/]+/g, '[^/]+').concat('$');
			return route.match(regex) || null;
		});
	}

	// Handle the request
	// addEventListener cannot have an async handler, therefore this must be encapsulated in an async function and passed to event.respondWith()
	protected handleResponse = async (handler: Handler): Promise<Response> => {
		try {
			const context: Context = { req: this.req, res: this.res };
			const handledResponse: Res | Response | void = await handler(context);

			if (handledResponse === undefined) {
				return new Responder(this.defaultHandler(context) as Res).send();
			} else if (handledResponse instanceof Res) {
				return new Responder(handledResponse as Res).send();
			} else {
				return handledResponse as Response;
			}
		} catch (e) {
			return new Responder(error(500)).send();
		}
	};

	/** Auth methods */
	public auth(authHandler: AuthHandler): this {
		this.authHandler = authHandler;
		return this;
	}

	protected authenticated(): boolean {
		this.authData = this.authHandler(this.req);
		if (this.authData) this.req.authData = this.authData;
		return this.authData !== false; // If authData === null, this returns true and allows the request to proceed unauthenticated, as wanted
	}

	/** Register methods */
	protected getRegisteredName(routeName: string): string {
		if (routeName === '' || routeName === '/') {
			return '__base_route';
		}

		let route = routeName;
		if (routeName.endsWith('/')) route = route.slice(0, -1);
		if (!routeName.startsWith('/')) route = '/'.concat(route);
		return route;
	}

	protected registerMethod(method: Method, route: string, handler: Handler, authenticate: boolean = true) {
		const registeredName = this.getRegisteredName(route);
		if (!this.register.paths[registeredName]) this.register.paths[registeredName] = {};
		this.register.paths[registeredName][method] = { handler, authenticate, context: this };
	}

	public fallback(handler: Handler): this {
		this.defaultHandler = handler;
		return this;
	}

	public route(path: string, router: Router): this {
		// No error thrown if route already exists, it is overwritten.
		this.register.routers[path] = router;
		return this;
	}

	/** HTTP Method methods */
	protected method(method: Method, ...args: any[]): this {
		const [route, arg1, arg2] = args;
		// NEED TO MAKE SURE ROUTE IS NOT AN EMPTY STRING, OR WE CAN MAKE IT AN '/' IF IT'S EMPTY
		typeof arg1 === 'boolean'
			? this.registerMethod(method, route, arg2 as Handler, arg1)
			: this.registerMethod(method, route, arg1);
		return this;
	}
	// GET
	public get(route: string, authenticate: boolean, handler: Handler): this;
	public get(route: string, handler: Handler): this;
	public get(...args: any[]): this {
		return this.method('GET', ...args);
	}
	// POST
	public post(route: string, authenticate: boolean, handler: Handler): this;
	public post(route: string, handler: Handler): this;
	public post(...args: any[]): this {
		return this.method('POST', ...args);
	}
	// PUT
	public put(route: string, authenticate: boolean, handler: Handler): this;
	public put(route: string, handler: Handler): this;
	public put(...args: any[]): this {
		return this.method('PUT', ...args);
	}
	// PATCH
	public patch(route: string, authenticate: boolean, handler: Handler): this;
	public patch(route: string, handler: Handler): this;
	public patch(...args: any[]): this {
		return this.method('PATCH', ...args);
	}
	// DELETE
	public delete(route: string, authenticate: boolean, handler: Handler): this;
	public delete(route: string, handler: Handler): this;
	public delete(...args: any[]): this {
		return this.method('DELETE', ...args);
	}
}

export default () => new Joey();
