export class Res {

}

// import { cookie, CookieOptions } from '../../Utilities/headers/';
// import type { ResponseBody, ResProperties, ResGetter, ErrorBody } from './types';
//
// export class Res {
// 	protected _body: ResponseBody;
// 	protected _status: number | null;
// 	protected _pretty: boolean;
// 	protected _error: unknown = null;
// 	public headers: Headers;
//
// 	constructor(body?: ResponseBody, status?: number, headers?: HeadersInit, pretty?: boolean) {
// 		this._body = body || null;
// 		this._status = status || null;
// 		this.headers = new Headers(headers || {});
// 		this._pretty = pretty === undefined ? false : pretty;
// 	}
//
// 	/**
// 	 * Gets the current values for body, status and pretty.
// 	 * Header can be accessed directly through 'RES.headers', where RES is an instance of Res.
// 	 * @return {Object} — Contains body, status and pretty
// 	 */
// 	public get get(): ResGetter {
// 		if (this._body) {
// 			return {
// 				body: this._body,
// 				status: this._status ? this._status : 200,
// 				pretty: this._pretty,
// 				error: this._error
// 			};
// 		}
// 		return {
// 			body: this._body,
// 			status: this._status ? this._status : 204,
// 			pretty: this._pretty,
// 			error: this._error
// 		};
// 	}
//
// 	public body(body: ResponseBody): this {
// 		this._body = body;
// 		return this;
// 	}
//
// 	public status(status: number): this {
// 		this._status = status;
// 		return this;
// 	}
//
// 	public prettify(pretty = true): this {
// 		this._pretty = pretty;
// 		return this;
// 	}
//
// 	/**
// 	 * Resets headers from a {@link HeadersInit} object.
// 	 * For header methods, use 'RES.headers.METHOD', where RES is an instance of Res.
// 	 * @param {HeadersInit} headers - Initialized headers
// 	 * @return {Res} — this instance for chaining
// 	 */
// 	public setHeaders(headers: HeadersInit): this {
// 		this.headers = new Headers(headers);
// 		return this;
// 	}
//
// 	/**
// 	 * Sets multiple properties on the current instance in a single method.
// 	 * @param {Partial<ResProperties>} res - An object literal containing Res properties
// 	 * @return {Res} — this instance for chaining
// 	 */
// 	public set(res: Partial<ResProperties>): this {
// 		if (res.body !== undefined) this.body(res.body);
// 		if (res.status !== undefined) this.status(res.status);
// 		if (res.headers !== undefined) this.setHeaders(res.headers);
// 		if (res.pretty !== undefined) this.prettify(res.pretty);
// 		if (res.error !== undefined) this._error = res.error;
// 		return this;
// 	}
//
// 	public get cookie() {
// 		return {
// 			set: (name: string, value: string, options?: CookieOptions) => {
// 				cookie.set(this.headers, name, value, options);
// 			},
// 			clear: (name: string, options?: Pick<CookieOptions, 'domain' | 'path'>) => {
// 				cookie.clear(this.headers, name, options);
// 			}
// 		};
// 	}
//
// 	public error(status: number, body?: ErrorBody, error?: unknown): this {
// 		this.status(status);
// 		this.body(body || null);
// 		// this.body(body ? body : null);
// 		if (error) this._error = error;
// 		return this;
// 	}
// }
//
// const a = new Res();
//
// console.log(a.headers);
//
// /* Can be handled natively via return Response.redirect(url, status); */
// // public redirect(url: string, status?: number):Response {
// // 	let num = status || 307;
// // 	if (num < 300 || num > 308) {	num = 307; }
// // 	return Response.redirect(url, num);
// // }
