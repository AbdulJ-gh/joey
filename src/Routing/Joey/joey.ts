import { Logger } from '../../Logger';
import { Dispatcher } from '../Dispatcher';
import { createContext, handleSystemError, sizeLimit } from '../helpers';
import { Req } from '../Req';
// import { Method } from '../Router';
import { Method, Router } from '../Router';
import { baseConfig, type Config } from '../config';
import { Register } from '../Register';

export type RouteMap = Record<string, Set<Method>>

class Joey extends Router {
	protected config: Required<Config> = baseConfig;
	private Logger?: Logger;
	private routeMap: RouteMap = {};

	public async fetch(request: Request, env: any, ctx: ExecutionContext) {
		ctx.passThroughOnException();
		try {
			if (!this.Logger) {
				this.Logger = new Logger({ logLevel: 'error', preserveAllTail: true });
			}
			const req = new Req(request);

			const limit = sizeLimit(req.URL, this.config);
			if (limit) return limit;

			this.start();

			const resolvedHandler = this.resolveHandler(req, this.config, this.routeMap);
			const context = createContext(
				ctx,
				req,
				resolvedHandler.config as Required<Config>,
				resolvedHandler.absolutePath
			);
			Logger.event(this.Logger as Logger, request, ctx);
			try {
				return await new Dispatcher(resolvedHandler.routerContext).handleResponse(
					resolvedHandler,
					context,
					this.Logger as Logger
				);
			} catch (err) {
				return handleSystemError(context.waitUntil, this.config, this.Logger as Logger, err as Error);
			}
		} catch (err) {
			return new Response(null, { status: 500 }); // Fallback
		}
	};

	/* Config */
	public configure(config: Config): this {
		this.config = { ...baseConfig, ...config };
		return this;
	}

	/* Logger */
	public logger(logger: Logger): this {
		this.Logger = logger;
		return this;
	}

	public start(): void {
		// TODO - Add CORS stuff here?? Or now that I have the routeMap object, this can be done at run time?
		const recursiveStitchApp = (router: Router = this, globalPrefix = '') => {
			const register = router['register'];
			const middleware = router['middleware'];
			const authenticator = router['authenticator'];

			for (const pathKey in register.paths) {
				const methods = Object.keys(register.paths[pathKey]) as Method[];
				let path = globalPrefix + pathKey;
				if (path.endsWith('/')) path = path.slice(0, -1);
				if (path.startsWith('//')) path = path.slice(1, path.length);

				if (!this.routeMap[path]) { this.routeMap[path] = new Set; }
				methods.forEach(method => this.routeMap[path].add(method));
			}

			for (const routerKey in register.routers) {
				// Set Middleware
				register.routers[routerKey]['middleware'] = [
					...middleware,
					...register.routers[routerKey]['middleware']
				];

				// Set configs
				register.routers[routerKey]['config'] = {
					...router['config'],
					...register.routers[routerKey]['config']
				};

				// Set Authenticators
				if (!register.routers[routerKey]['authenticator']) {
					register.routers[routerKey]['authenticator'] = authenticator;
				}

				recursiveStitchApp(register.routers[routerKey], Register.getRegisteredName(globalPrefix + routerKey));
			}
		};
		recursiveStitchApp();
	}
}

export default () => new Joey();


// ERROR
function err(err: Error) {
	return {
		name: err.name,
		message: err.message,
		stack: err.stack
	};
}
