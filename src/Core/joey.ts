import Register, { type Paths } from './register';
import Dispatcher from './dispatcher';
import { Req } from './Req';
import Context from './context';
import type { Logger } from './logger';
import type { ResolvedHandler, MiddlewareHandler, Validator } from './types';
import { type Config, defaultConfig } from './config';

export default class Joey {
	readonly register: Register<ResolvedHandler>;
	readonly middleware: MiddlewareHandler[];
	readonly config: Config;
	readonly logger?: Logger;
	readonly validators: Validator[];

	constructor(
		paths: Paths<ResolvedHandler>,
		config?: Partial<Config>,
		middleware?: MiddlewareHandler[],
		logger?: Logger,
		validators?: Validator[]
	) {
		this.register = new Register(paths);
		this.config = { ...defaultConfig, ...config };
		this.middleware = middleware || [];
		this.logger = logger;
		this.validators = validators || [];
	}

	public fetch: ExportedHandlerFetchHandler = async (request, env, ctx) => {
		ctx.passThroughOnException(); // The pass through server needs to be defined somewhere?
		try {
			const req = new Req(request);
			const resolvedHandler = this.resolve(req);
			const context = new Context(ctx, req, env, this.validators, this.logger);
			return await Dispatcher.respond(req, resolvedHandler, context as Context, this.config, this.middleware);
		} catch (err) {
			const { status, body, headers } = this.config.internalServerError;
			return new Response((body || null) as BodyInit, { status, headers });
		}
	};

	private resolve(req: Req): ResolvedHandler {
		const [path, method] = [req.url.pathname, req.method];
		const lookup = this.register.lookup(path, method);

		if (lookup === null) {
			return {
				handler: () => this.config.notFound,
				path: '',
				config: this.config,
				middleware: this.middleware
			};
		}

		if (typeof lookup === 'string') {
			const headers = this.config.notFound.headers || {};
			if (this.config.emitAllowHeader) {
				const methods = this.register.methods(lookup);
				headers.allow = methods.join(', ');
			}

			return {
				handler: () => ({ ...this.config.notFound, headers }),
				path: '',
				config: this.config,
				middleware: this.middleware
			};
		}

		return lookup;
	}
}


export {};
