export { Req } from './req';


/**
 * Allows functional/method chaining, direct property update, or object set
 * */

// Core philosophy - assumes you want to send a JSON/String/Blank/Buffer (based on body)
// Waits for you to RETURN something, so no magic on will/won't it on methods (i.e. like express)
// Allows you to stop and return within any middleware

// ON REQ
// NICE TO HAVE - if a url has /user/:id -> return the data as objects
// NEED TO ALSO Automatically PARSE INCOMING JSON

// CAN USE HTMLREWRITER TO PARSE KV STORED HTML AND REPLACE CERTAIN VALUES. SUCH AS CODE FOR EMAIL SIGN UP.

// For fetched responses, not for constructed responses.
// Have helpers for async jsonFetch, blobFetch, bufferFetch - OR have single function/class for this


/**
 * Potential headers I could add a specific method for
 * allow - automatic based on config?
 * cacheControl - separate module?
 * setCookie - cookie module
 * vary?
 * etag
 * */


// export class Res {
// 	protected _error: ErrorType = null;
// 	protected _additionalData: AdditionalData = null;
//
// 	public error(status: number): this;
// 	public error(status: number, body: ErrorBody, error?: ErrorType, additionalData?: AdditionalData): this;
// 	public error(...args: [number, ErrorBody?, ErrorType?, AdditionalData?]): this {
// 		if (args.length > 1) {
// 			const [status, body, error, additionalData] = args;
// 			this.status = status;
// 			if (body !== undefined) this.body = body;
// 			if (error !== undefined) this._error = error;
// 			if (additionalData !== undefined) this._additionalData = additionalData;
// 		} else {
// 			this.status = args[0];
// 		}
//
// 		// this.body = args.length === 1 || args[1] === true ? httpStatuses[status] : args[1] as ResponseBody;
// 		return this;
// 	}
// }

// export class Res2 {
// 	protected _error: Error | string | null = null;
// 	protected _additionalData: Record<string, unknown> | null = null;
//
// 	public get isError(): boolean { return this._error !== null; }
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
