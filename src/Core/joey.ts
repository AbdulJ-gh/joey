import Register, { type Paths } from './register';
import Dispatcher from './dispatcher';
import { Req } from './req';
import Context from './context';
import type { Logger } from '../logger';
import type { ResolvedHandler, MiddlewareHandler } from './types';
import { type Config } from './config';

type LoggerInit = (logger: Logger, request: Request, ctx: ExecutionContext, env: unknown) => void;

export default class Joey {
	readonly register: Register<ResolvedHandler>;
	readonly middleware: MiddlewareHandler[];
	readonly config: Config;
	readonly logger?: Logger;
	readonly loggerInit?: LoggerInit;

	constructor(
		paths: Paths<ResolvedHandler>,
		config: Config,
		middleware?: MiddlewareHandler[],
		logger?: Logger,
		loggerInit?: LoggerInit
	) {
		this.register = new Register(paths);
		this.config = config;
		this.middleware = middleware || [];
		this.logger = logger;
		this.loggerInit = loggerInit;
	}

	public fetch: ExportedHandlerFetchHandler = async (request, env, ctx) => {
		ctx.passThroughOnException(); // The pass through server needs to be defined somewhere?
		try {
			this.logger && this.loggerInit && this.initLogger(this.loggerInit, this.logger, request, ctx, env);
			const req = new Req(request);
			const resolvedHandler = this.resolve(req);
			const context = new Context(ctx, req, env, this.logger);
			return await Dispatcher.respond(req, resolvedHandler, context as Context, this.config, this.middleware);
		} catch (err: unknown) {
			try {
				this.logger && ctx.waitUntil(this.logger['exceptionHandler'](err) as Promise<void>);
				const { status, body, headers } = this.config.internalServerError;
				return new Response((body || null) as BodyInit, { status, headers });
			} catch (e) {
				console.log('ERROR:', e);
				return new Response(null, { status: 500 });
			}
		}
	};

	public initLogger(loggerInit: LoggerInit, ...args: [Logger, Request, ExecutionContext, unknown]): void {
		loggerInit(...args);
	}

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
			const headers = this.config.methodNotAllowed.headers || {};
			if (this.config.emitAllowHeader) {
				const methods = this.register.methods(lookup);
				headers.allow = methods.join(', ');
			}

			return {
				handler: () => ({ ...this.config.methodNotAllowed, headers }),
				path: '',
				config: this.config,
				middleware: this.middleware
			};
		}

		return lookup;
	}
}
