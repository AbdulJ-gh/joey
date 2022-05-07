import { cookie, CookieOptions } from '../Utilities/headers/';

import type { DeserialisedJson, ResponseObject } from './types';
export type ResponseBody = null | string | DeserialisedJson | ArrayBuffer | Blob | URLSearchParams | FormData;
export declare type ResGetter = Omit<ResponseObject, 'headers'>;


export class Res {
	protected _body: ResponseBody;
	protected _status: number | null;
	public headers: Headers;

	constructor(body?: ResponseBody, status?: number, headers?: HeadersInit) {
		this._body = body || null;
		this._status = status || null;
		this.headers = new Headers(headers || {});
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
				status: this._status ? this._status : 200
			};
		}
		return {
			body: this._body,
			status: this._status ? this._status : 204
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
	 * Does not overwrite existing values if not specified.
	 * @param {ResponseObject} res - An object literal containing Res properties
	 * @return {Res} — this instance for chaining
	 */
	public set(res: ResponseObject): this {
		if (res.body !== undefined) this.body(res.body);
		if (res.status !== undefined) this.status(res.status);
		if (res.headers !== undefined) this.setHeaders(res.headers);
		return this;
	}

	public get cookie() {
		return {
			set: (name: string, value: string, options?: CookieOptions) => {
				cookie.set(this.headers, name, value, options);
			},
			clear: (name: string, options?: Pick<CookieOptions, 'domain' | 'path'>) => {
				cookie.clear(this.headers, name, options);
			}
		};
	}

	public redirect(url: string, status?: number): Response {
		let num = status || 307;
		if (num < 300 || num > 308) { num = 307; }
		return Response.redirect(url, num);
	}
}
