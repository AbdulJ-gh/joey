type LogLevel = 'off' | 'debug' | 'info' | 'log' | 'warn' | 'error';
type LoggerOptions = {
	logLevel?: LogLevel;
	preserveTail?: boolean;
	preserveAllTail?: boolean;
	captureClientErrors?: boolean;
}
type Options = Required<LoggerOptions>

const defaultOptions: Options = {
	logLevel: 'log',
	preserveTail: true,
	preserveAllTail: false,
	captureClientErrors: false
};

/* eslint-disable @typescript-eslint/no-explicit-any */
// Need to allow `any` in order to allow users to define their own function types
type IncomingEventHandler = (request: Request) => Promise<void>;
type LogHandler = (logLevel: LogLevel, ...args: any[]) => Promise<void>;
type ExceptionHandler = (...args: any[]) => Promise<void>;
/* eslint-enable @typescript-eslint/no-explicit-any */

// Exception handler would be used when catching system errors, and when returning errors from Res.error

export class Logger {
	private readonly options: Options;
	private readonly levelIndex: number;
	private readonly levels: LogLevel[] = ['off', 'debug', 'info', 'log', 'warn', 'error'];
	private ctx: ExecutionContext = {} as ExecutionContext;
	private incomingEventHandler: IncomingEventHandler = async () => {/**/};
	private logHandler: LogHandler = async () => {/**/};
	private exceptionHandler: ExceptionHandler = async (error: unknown) => this.defaultExceptionHandler(error);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;

	constructor(options?: LoggerOptions) {
		this.options = { ...defaultOptions, ...options };
		this.levelIndex = this.levels.findIndex(level => level === this.options.logLevel);
		if (this.levelIndex < 0) this.levelIndex = 3;
	}

	public static incomingEventHandler(logger: Logger, handler: IncomingEventHandler) {
		logger.incomingEventHandler = handler;
	}
	public static event(logger: Logger, request: Request, ctx: ExecutionContext) {
		logger.ctx = ctx;
		ctx.waitUntil(logger.incomingEventHandler(request));
	}
	public static logHandler(logger: Logger, handler: LogHandler) {
		logger.logHandler = handler;
	}
	public static exceptionHandler(logger: Logger, handler: ExceptionHandler) {
		logger.exceptionHandler = handler;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	private async defaultExceptionHandler(error: unknown) {
		this.levelLog(1, error);
	}

	private tail(logLevel: number, ...args: unknown[]) {
		const level = this.levels[logLevel]; // Separated out to satisfy ts compiler
		if (level !== 'off') console[level](...args);
	}

	private levelLog(logLevel: number, ...args: unknown[]): void {
		if (logLevel >= this.levelIndex) {
			logLevel === 5
				? this.ctx.waitUntil(this.exceptionHandler(args[5]))
				: this.ctx.waitUntil(this.logHandler(this.levels[logLevel], ...args));
			if (this.options.preserveTail || this.options.preserveAllTail) {
				this.tail(logLevel, ...args);
			}
		} else if (this.options.preserveAllTail) {
			this.tail(logLevel, ...args);
		}
	}
	public error(...args: unknown[]) { this.levelLog(5, ...args); }
	public warn(...args: unknown[]) { this.levelLog(4, ...args); }
	public log(...args: unknown[]) { this.levelLog(3, ...args); }
	public info(...args: unknown[]) { this.levelLog(2, ...args); }
	public debug(...args: unknown[]) { this.levelLog(1, ...args); }
}
