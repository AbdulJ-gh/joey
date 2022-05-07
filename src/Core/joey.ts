import Register, { type Paths } from './register';
import Dispatcher from './dispatcher';
import { Req } from './Req';
import Context from './context';
import { Logger } from './logger';
import type { ResolvedHandler, MiddlewareHandler, Handler } from './types';
import { Config, defaultConfig } from './config';

export type { Handler }; //This should be exported from index.ts?

export default class Joey {
	public readonly register: Register<ResolvedHandler>;
	public readonly middleware: MiddlewareHandler[];
	public readonly config: Config;
	public readonly logger?: Logger;

	constructor(
		paths: Paths<ResolvedHandler>,
		config?: Partial<Config>,
		middleware?: MiddlewareHandler[],
		logger?: Logger
	) {
		this.register = new Register(paths);
		this.config = { ...defaultConfig, ...config };
		this.middleware = middleware || [];
		this.logger = logger;
	}

	public fetch: ExportedHandlerFetchHandler = async (request, env, ctx) => {
		ctx.passThroughOnException(); // The pass through server needs to be defined somewhere?
		try {
			const req = new Req(request);
			const resolvedHandler = this.resolve(req);
			const context = new Context(ctx, req, env, this.logger);
			return await Dispatcher.respond(req, resolvedHandler, context as Context, this.config);
		} catch (err) {
			const { status, body, headers } = this.config.internalServerError;
			return new Response((body || null) as BodyInit, { status, headers }); // Messy, abstract
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
				middleware: []
			};
		}

		if (typeof lookup === 'string') {
			const methods = this.register.methods(lookup);
			const headers = this.config.emitAllowHeader
				? { ...this.config.notFound.headers, allow: methods.join(', ') }
				: this.config.notFound.headers;

			return {
				handler: () => ({ ...this.config.notFound, headers }),
				path: '',
				config: this.config,
				middleware: []
			};
		}

		return {
			...lookup,
			config: {
				...this.config,
				...lookup.config,
				headers: { ...this.config.headers, ...lookup.config.headers }
			},
			middleware: [...this.middleware, ...lookup.middleware]
		};
	}
}


export {};
