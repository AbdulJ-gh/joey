import type { Request as CfRequest } from '@cloudflare/workers-types';
import type { DeserialisedJson, Method } from '../types';
import { Headers, Cookie, QueryParams, type Params, UnparsedParams } from '../../Utilities';
import { transformParam } from '../../Transforms/params';
import { parseBody, parsePathParams } from './helpers';


export type UnknownRecord = Record<string, unknown>;

export type ReqArgs<QP = UnknownRecord, PP = UnknownRecord, AF = UnknownRecord> = {
	query: QP,
	path: PP,
	additional: AF
}
type RequestBody = null | string | DeserialisedJson | ArrayBuffer | Blob;
export type RequestBodyStream = null | 'plaintext' | 'json' | 'formData' | 'buffer' | 'blob';

const { getAllQueryParams } = QueryParams;

class BaseRequest {
	constructor(public readonly request: Request) {}
	get bodyUsed() { return this.request.bodyUsed; }
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	get cf(): CfProperties { return (this.request as CfRequest).cf ?? {}; }
	get method(): Method { return this.request.method as Method; }
	public clone = () => this.request.clone();
	public arrayBuffer = () => this.request.arrayBuffer();
	public blob = () => this.request.blob();
	public formData = () => this.request.formData();
	public json = <T>(): Promise<T> => this.request.json();
	public text = () => this.request.text();
}


export class Req<R extends ReqArgs = ReqArgs> extends BaseRequest {
	public readonly url: URL;
	public readonly cookies: Record<string, string> = {};
	public readonly headers: Record<string, string> = {};
	public readonly queryParams = <R['query']>{};
	public readonly pathParams = <R['path']>{};
	public route = ''; // This value gets injected at runtime by the static parsePathParams method
	public body: RequestBody = null;
	public additionalFields = <R['additional']>{};
	// Potentials names: fields, data, props, custom, customData, customFields, additionalData, additionalFields

	constructor(request: Request, transformParams: boolean = true) {
		super(request);
		this.url = new URL(request.url);
		this.cookies = Cookie.getAll(request.headers);
		this.headers = Headers.getHeadersObject(request.headers);
		this.queryParams = Req.parseQueryParams(request.url, transformParams);
	}

	private static parseQueryParams(url: string, transform: boolean): Params | UnparsedParams {
		return transform ? getAllQueryParams(url, transformParam) : getAllQueryParams(url);
	}

	// These are called at runtime before passing control to the handler
	public static parsePathParams = parsePathParams;
	public static parseBody = parseBody;
}
