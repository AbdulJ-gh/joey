import type {
	ExecutionContext,
	ExportedHandler,
	ExportedHandlerFetchHandler,
	ExportedHandlerQueueHandler,
	ExportedHandlerScheduledHandler,
	Request as CfRequest,
	Response as CfResponse
} from '@cloudflare/workers-types';
import Register, { type Paths } from './register';
import Dispatcher from './dispatcher';
import { resolveHandler } from './resolver';
import { Req } from './req';
import Context from './context';
import type { Logger } from '../Logger';
import type { Config, RegisteredHandler, MiddlewareHandler } from './types';

type LoggerInit = (logger: Logger, request: CfRequest, ctx: ExecutionContext, env: unknown) => void;

export default class Joey implements ExportedHandler {
	readonly register: Register<RegisteredHandler>;
	readonly middleware: MiddlewareHandler[];
	readonly config: Config;
	readonly logger?: Logger;
	readonly loggerInit?: LoggerInit;

	constructor(
		paths: Paths<RegisteredHandler>,
		config: Config,
		middleware?: MiddlewareHandler[],
		logger?: Logger,
		loggerInit?: LoggerInit
	) {
		this.register = new Register(paths);
		this.config = config;
		this.middleware = middleware ?? [];
		this.logger = logger;
		this.loggerInit = loggerInit;
	}

	public fetch: ExportedHandlerFetchHandler = async (
		request: CfRequest,
		env: unknown,
		ctx: ExecutionContext
	): Promise<CfResponse> => {
		ctx.passThroughOnException();
		try {
			if (this.logger && this.loggerInit) { this.loggerInit(this.logger, request, ctx, env); }			/** Initialise logger */
			const req = new Req(request);																																	/** Initialise Req object */
			const context = new Context(ctx, req, env, this.logger);																			/** Initialise context */
			const handler = resolveHandler(req, this.config, this.register);															/** Resolve handler from request */
			return await Dispatcher.respond(context, handler, this.config, this.middleware);							/** Dispatch response */
		} catch (err: unknown) {
			try {
				this.logger && ctx.waitUntil(this.logger['exceptionHandler'](err) as Promise<void>);		/** Log exception */
				const { status, body, headers } = this.config.internalServerError;											/** Respond with default 500 response */
				return new Response((body as BodyInit ?? null), {
					status,
					headers: headers ?? {}
				}) as unknown as CfResponse;
			} catch (e) {
				console.error('ERROR:', e);
				return new Response('Something went wrong', { status: 500 }) as unknown as CfResponse;							/** Last ditch 500 response */
			}
		}
	};

	public queue: ExportedHandlerQueueHandler = async (batch, env, ctx) => {
		console.log(batch, env, ctx);
	};

	public scheduled: ExportedHandlerScheduledHandler = async (controller, env, ctx) => {
		console.log(controller, env, ctx);
	};
}
