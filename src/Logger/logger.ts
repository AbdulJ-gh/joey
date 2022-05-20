type LogLevel = 'off' | 'debug' | 'info' | 'log' | 'warn' | 'error';
type LoggerOptions = {
	logLevel?: LogLevel;
	preserveTail?: boolean;
	preserveAllTail?: boolean;
};

type Options = Required<LoggerOptions>;

const defaultOptions: Options = {
	logLevel: 'log',
	preserveTail: true,
	preserveAllTail: false
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type IncomingEventHandler = (request: Request, env: unknown) => Promise<void>|void;
type LogHandler = (logLevel: LogLevel, ...args: any[]) => Promise<void>|void;
type ExceptionHandler = (error: unknown) => Promise<void>|void;
/* eslint-enable @typescript-eslint/no-explicit-any */

export class Logger {
	private readonly options: Options;
	private readonly levelIndex: number;
	private readonly levels: LogLevel[] = ['off', 'debug', 'info', 'log', 'warn', 'error'];
	[key: string]: unknown;
	private ctx: ExecutionContext = <ExecutionContext>{};
	private incomingEventHandler: IncomingEventHandler = async () => { /**/ };
	private logHandler: LogHandler = async () => { /**/ };
	private exceptionHandler: ExceptionHandler = (error: unknown) => { this.levelLog(1, error); };

	constructor(options?: LoggerOptions) {
		this.options = { ...defaultOptions, ...options };
		this.levelIndex = this.levels.findIndex(level => level === this.options.logLevel); // -1 if not found
		if (this.levelIndex < 0) this.levelIndex = 3;
	}

	// These are static methods in order to keep the interface clean
	private static event(logger: Logger, request: Request, ctx: ExecutionContext, env: unknown) {
		logger.ctx = ctx;
		ctx.waitUntil((async () => { await logger.incomingEventHandler(request, env); })());
	}

	public static incomingEventHandler(logger: Logger, handler: IncomingEventHandler) {
		logger.incomingEventHandler = handler;
	}


	public static logHandler(logger: Logger, handler: LogHandler) {
		logger.logHandler = handler;
	}

	public static exceptionHandler(logger: Logger, handler: ExceptionHandler) {
		logger.exceptionHandler = handler;
	}

	private tail(logLevel: number, ...args: unknown[]) {
		const level = this.levels[logLevel];
		if (level !== 'off') console[level](...args);
	}

	private levelLog(logLevel: number, ...args: unknown[]): void {
		if (logLevel >= this.levelIndex) {
			this.ctx.waitUntil((async () => { await this.logHandler(this.levels[logLevel], ...args); })());
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
