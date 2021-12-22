import { ResponseBody, ErrorBody, ErrorType, ResProperties } from './types';
import httpStatuses from '../../Utilities/general/statuses';

const defaults: ResProperties = {
	body: {},
	status: 200,
	headers: {},
	pretty: false
};

export class Res {
	protected _body: ResponseBody = defaults.body;
	protected _status: number = defaults.status;
	protected _headers: Headers = new Headers(defaults.headers);
	protected _pretty: boolean = defaults.pretty;
	protected _error: Error | string | null = null;
	protected _additionalData: Record<string, unknown> | null = null;

	constructor(body?: ResponseBody, status?: number, headers?: HeadersInit, pretty?: boolean) {
		this._body = body || defaults.body;
		this._status = status || defaults.status;
		this._headers = new Headers(headers) || new Headers(defaults.headers);
		this._pretty = pretty || defaults.pretty;
	}

	public get body(): ResponseBody { return this._body; }
	public get status(): number { return this._status; }
	public get headers(): Headers { return this._headers; }
	public get pretty(): boolean { return this._pretty; }
	public get isError(): boolean { return this._error !== null; }

	public setBody(body: ResponseBody): this { this._body = body; return this; }
	public setStatus(status: number): this { this._status = status; return this; }
	public setHeaders(headers: HeadersInit): this { this._headers = new Headers(headers); return this; }
	public prettify(bool = true): this { this._pretty = bool; return this;}

	public appendHeaders(headers: HeadersInit): this {
		// This needs some magic to work with the different possible types of HeadersInit
		console.log(headers);
		return this;
	}

	public set(res: Partial<ResProperties>): this {
		const { body, status, headers, pretty } = res;
		if (body !== undefined) this._body = body;
		if (status !== undefined) this._status = status;
		if (headers !== undefined) this._headers = new Headers(headers);
		if (pretty !== undefined) this._pretty = pretty;
		return this;
	}

	public error(status: number): this;
	public error(status: number, body: ErrorBody, error?: ErrorType, additionalData?: Record<string, unknown>): this;
	public error(status: number, useDefault: true, error?: ErrorType, additionalData?: Record<string, unknown>): this;
	public error(...args: [ number, (ErrorBody | true)?, (string | Error)?, Record<string, unknown>? ]): this {
		const [status] = args;
		this._status = status;
		this._body = args.length === 1 || args[1] === true ? httpStatuses[status] : args[1] as ResponseBody;
		if (args[2] !== undefined) this._error = args[2];
		if (args[3] !== undefined) this._additionalData = args[3];
		return this;
	}
}
