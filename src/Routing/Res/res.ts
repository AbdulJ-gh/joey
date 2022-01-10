import type { ResponseBody, ResProperties, ResGetter } from './types';

export class Res {
	protected _body: ResponseBody;
	protected _status: number;
	protected _pretty: boolean;
	public headers: Headers;

	constructor(body?: ResponseBody, status?: number, headers?: HeadersInit, pretty?: boolean) {
		this._body = body || null;
		this._status = status || 200;
		this.headers = new Headers(headers || {});
		this._pretty = pretty === undefined ? false : pretty;
	}

	protected *[Symbol.iterator](): Iterator<unknown> {
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
		return {
			body: this._body,
			status: this._status,
			pretty: this._pretty
		};
	}

	public body(body: ResponseBody): this {
		this._body = body;
		return this;
	}
	public status(status: number): this {
		this._status = status;
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
	 * Sets the 'content-type' response header.
	 * @param {string} contentType - header value
	 * @return {Res} — this instance for chaining
	 */
	public contentType(contentType: string): this {
		this.headers.set('content-type', contentType);
		return this;
	}
	/**
	 * Sets multiple properties on the current instance in a single method.
	 * @param {Partial<ResProperties>} res - An object literal containing Res properties
	 * @return {Res} — this instance for chaining
	 */
	public set(res: Partial<ResProperties>): this {
		if (res.body !== undefined) this._body = res.body;
		if (res.status !== undefined) this._status = res.status;
		if (res.headers !== undefined) this.headers = new Headers(res.headers);
		if (res.pretty !== undefined) this._pretty = res.pretty;
		return this;
	}
}
