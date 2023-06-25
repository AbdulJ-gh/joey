import type { DeserialisedJson, Method } from '../types';
import { cookie, getHeadersObject } from '../../Utilities/headers/';
import { type ParamsRecord } from '../../Transforms/params';
import { parseBody, parsePathParams, parseQueryParams } from './helpers';

export type UnknownRecord = Record<string, unknown>;

type RequestBody = null | string | DeserialisedJson | ArrayBuffer | Blob;
export type RequestBodyStream = null | 'plaintext' | 'json' | 'formData' | 'buffer' | 'blob';

class BaseRequest {
	constructor(public readonly request: Request) {}
	get bodyUsed() { return this.request.bodyUsed; }
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	get cf(): CfProperties { return this.request.cf ?? {}; }
	get method(): Method { return this.request.method as Method; }
	get clone() { return () => this.request.clone(); }
	get arrayBuffer(): () => Promise<ArrayBuffer> { return this.request.arrayBuffer; }
	get blob(): () => Promise<Blob> { return this.request.blob; }
	get formData(): () => Promise<FormData> { return this.request.formData; }
	get json(): <T>() => Promise<T> { return this.request.json; }
	get text(): () => Promise<string> { return this.request.text; }
}

export class Req<T = UnknownRecord> extends BaseRequest {
	public readonly url: URL;
	public readonly cookies: Record<string, string> = {};
	public readonly headers: Record<string, string> = {};
	public readonly queryParams: ParamsRecord = {};
	public readonly pathParams: ParamsRecord = {};
	public route = ''; // This value gets injected at runtime by the static parsePathParams method
	public body: RequestBody = null;
	public additionalFields = <T>{}; // Potentials names: fields, data, props, custom, customData, customFields, additionalData, additionalFields

	constructor(request: Request) {
		super(request);
		this.url = new URL(request.url);
		this.cookies = cookie.getAll(request.headers);
		this.headers = getHeadersObject(request.headers);
	}

	// These are called at runtime before passing control to the handler
	public static parseQueryParams = parseQueryParams;
	public static parsePathParams = parsePathParams;
	public static parseBody = parseBody;
}
