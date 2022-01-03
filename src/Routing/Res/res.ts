import httpStatuses from '../../Utilities/general/statuses';
import type { ResponseBody, ErrorBody, ErrorType, ResProperties } from './types';

/**
 * Allows functional/method chaining, direct property update, or object set
 * */

export class Res {
	public body: ResponseBody;
	public status: number;
	public headers: Headers;
	public pretty: boolean;

	constructor(body: ResponseBody = null, status = 200, headers: HeadersInit = {}, pretty = false) {
		this.body = body;
		this.status = status;
		this.headers = new Headers(headers);
		this.pretty = pretty;
	}

	public prettify(pretty = true): this {
		this.pretty = pretty;
		return this;
	}
	public setBody(body: ResponseBody): this {
		this.body = body;
		return this;
	}
	public setStatus(status: number): this {
		this.status = status;
		return this;
	}
	public setHeaders(headers: HeadersInit): this {
		this.headers = new Headers(headers);
		return this;
	}

	public set(res: Partial<ResProperties>): this {
		if (res.body !== undefined) this.body = res.body;
		if (res.status !== undefined) this.status = res.status;
		if (res.headers !== undefined) this.headers = new Headers(res.headers);
		if (res.pretty !== undefined) this.pretty = res.pretty;
		return this;
	}
}

const a = new Res;


// export class Res2 {
// 	protected _error: Error | string | null = null;
// 	protected _additionalData: Record<string, unknown> | null = null;
//
// 	public get isError(): boolean { return this._error !== null; }
//
//
// 	public error(status: number): this;
// 	public error(status: number, body: ErrorBody, error?: ErrorType, additionalData?: Record<string, unknown>): this;
// 	public error(status: number, useDefault: true, error?: ErrorType, additionalData?: Record<string, unknown>): this;
// 	public error(...args: [ number, (ErrorBody | true)?, (string | Error)?, Record<string, unknown>? ]): this {
// 		const [status] = args;
// 		this._status = status;
// 		this._body = args.length === 1 || args[1] === true ? httpStatuses[status] : args[1] as ResponseBody;
// 		if (args[2] !== undefined) this._error = args[2];
// 		if (args[3] !== undefined) this._additionalData = args[3];
// 		return this;
// 	}
// }
