// export default class Logger {
// 	public debug: (...args: any[]) => void = () => {};
// 	public info: (...args: any[]) => void = () => {};
// 	public log: (...args: any[]) => void = () => {};
// 	public warn: (...args: any[]) => void = () => {};
// 	public error: (...args: any[]) => void = () => {};
// }

// TODO

type LogLevel = 'off' | 'debug' | 'info' | 'log' | 'warn' | 'error';
type LoggerOptions = {
	logLevel?: LogLevel;
	preserveTail?: boolean;
	preserveAllTail?: boolean;
	captureClientErrors?: boolean;
};

type Options = Required<LoggerOptions>;

const defaultOptions: Options = {
	logLevel: 'log',
	preserveTail: true,
	preserveAllTail: false,
	captureClientErrors: false
};

// Need to allow `any` in order to allow users to define their own function types
type IncomingEventHandler = (request: Request) => Promise<void>;
type LogHandler = (logLevel: LogLevel, ...args: any[]) => Promise<void>;
type ExceptionHandler = (...args: any[]) => Promise<void>;

// Exception handler would be used when catching system errors, and when returning errors from Res.error
//
// export class Logger2 {
// 	private exceptionHandler: ExceptionHandler = async (error: unknown) => {
// 		await this.defaultExceptionHandler(error);
// 	};
//
// 	// eslint-disable-next-line @typescript-eslint/require-await
// 	private async defaultExceptionHandler(error: unknown) {
// 		this.levelLog(1, error);
// 	}
// }

export class LoggerInit {
	protected readonly options: Options;
	protected readonly levelIndex: number;
	protected readonly levels: LogLevel[] = ['off', 'debug', 'info', 'log', 'warn', 'error'];
	protected incomingEventHandler: IncomingEventHandler = async () => {};
	protected logHandler: LogHandler = async () => {};
	protected exceptionHandler: ExceptionHandler = async (error: unknown) => {
		await this.defaultExceptionHandler(error);
	};

	[key: string]: any;

	constructor(options?: LoggerOptions) {
		this.options = { ...defaultOptions, ...options };
		this.levelIndex = this.levels.findIndex(level => level === this.options.logLevel);
		if (this.levelIndex < 0) this.levelIndex = 3;
	}

	public static incomingEventHandler(logger: LoggerInit, handler: IncomingEventHandler) {
		logger.incomingEventHandler = handler;
	}

	public static logHandler(logger: LoggerInit, handler: LogHandler) {
		logger.logHandler = handler;
	}

	public static exceptionHandler(logger: LoggerInit, handler: ExceptionHandler) {
		logger.exceptionHandler = handler;
	}

	protected tail(logLevel: number, ...args: unknown[]) {
		const level = this.levels[logLevel];
		if (level !== 'off') console[level](...args);
	}
}

type WaitUntil = (promise: Promise<any>) => void;

export class Logger extends LoggerInit {
	private readonly waitUntil: WaitUntil;

	constructor(request: Request, waitUntil: WaitUntil) {
		super();
		this.waitUntil = waitUntil;
		// The incomingEventHandler handler should really be done after stuff like extract body, so logs can be more helpful?
		this.incomingEventHandler(request); // Try catch?
	}

	private logEvent(logLevel: number, ...args: unknown[]): void {
		if (logLevel >= this.levelIndex) {
			logLevel === 5
				? this.waitUntil(this.exceptionHandler(args[5]))
				: this.waitUntil(this.logHandler(this.levels[logLevel], ...args));

			if (this.options.preserveTail || this.options.preserveAllTail) {
				this.tail(logLevel, ...args);
			}
		} else if (this.options.preserveAllTail) {
			this.tail(logLevel, ...args);
		}
	}

	public error(...args: unknown[]) {
		this.logEvent(5, ...args);
	}

	public warn(...args: unknown[]) {
		this.logEvent(4, ...args);
	}

	public log(...args: unknown[]) {
		this.logEvent(3, ...args);
	}

	public info(...args: unknown[]) {
		this.logEvent(2, ...args);
	}

	public debug(...args: unknown[]) {
		this.logEvent(1, ...args);
	}
}
