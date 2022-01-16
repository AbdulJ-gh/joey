import type { ResponseBody, ResProperties, ResGetter } from './types';

export class Res {
	protected _body: ResponseBody;
	protected _status: number | null;
	protected _statusChanged = false;
	protected _pretty: boolean;
	public headers: Headers;

	constructor(body?: ResponseBody, status?: number, headers?: HeadersInit, pretty?: boolean) {
		this._body = body || null;
		this._status = status || null;
		this.headers = new Headers(headers || {});
		this._pretty = pretty === undefined ? false : pretty;
	}

	protected* [Symbol.iterator](): Iterator<unknown> {
		yield this._body;
		yield this._status;
		yield this.headers;
		yield this._pretty;
	}

	/**
	 * Gets the current values for body, status and pretty.
	 * Header can be accessed directly through 'RES.headers', where RES is an instance of Res.
	 * @return {Object} — Contains body, status and pretty
	 */
	public get get(): ResGetter {
		if (this._body) {
			return {
				body: this._body,
				status: this._status ? this._status : 200,
				pretty: this._pretty
			};
		}
		return {
			body: this._body,
			status: this._status ? this._status : 204,
			pretty: this._pretty
		};
	}

	public body(body: ResponseBody): this {
		this._body = body;
		return this;
	}

	public status(status: number): this {
		this._status = status;
		if (!this._statusChanged) {
			this._statusChanged = true;
		}
		return this;
	}

	public prettify(pretty = true): this {
		this._pretty = pretty;
		return this;
	}

	/**
	 * Resets headers from a {@link HeadersInit} object.
	 * For header methods, use 'RES.headers.METHOD', where RES is an instance of Res.
	 * @param {HeadersInit} headers - Initialized headers
	 * @return {Res} — this instance for chaining
	 */
	public setHeaders(headers: HeadersInit): this {
		this.headers = new Headers(headers);
		return this;
	}

	/**
	 * Sets multiple properties on the current instance in a single method.
	 * @param {Partial<ResProperties>} res - An object literal containing Res properties
	 * @return {Res} — this instance for chaining
	 */
	public set(res: Partial<ResProperties>): this {
		if (res.body !== undefined) this.body(res.body);
		if (res.status !== undefined) this.status(res.status);
		if (res.headers !== undefined) this.setHeaders(res.headers);
		if (res.pretty !== undefined) this.prettify(res.pretty);
		return this;
	}
}
