import type { Request as CfRequest, CfProperties, Blob, FormData } from '@cloudflare/workers-types';
import type { DeserialisedJson, Method } from '../types';
import { Headers, Cookie, QueryParams, type Params, UnparsedParams } from '../../Utilities';
import { transformParam } from '../../Transforms/params';
import { parseBody, parsePathParams, normaliseRequest } from './helpers';

export type UnknownRecord = Record<string, unknown>;

export type ReqArgs<QP = UnknownRecord, PP = UnknownRecord, AF = UnknownRecord> = {
	query: QP,
	path: PP,
	additional: AF
}
type RequestBody = null | string | DeserialisedJson | ArrayBuffer | Blob | FormData;


const { getAllQueryParams } = QueryParams;

class BaseRequest {
	public readonly request: CfRequest = {} as CfRequest;
	constructor(request: CfRequest | RequestInfo) {
		this.request = normaliseRequest(request);
	}

	get bodyUsed() { return this.request.bodyUsed; }
	get cf(): CfProperties { return (this.request as CfRequest).cf ?? {}; }
	get method(): Method { return this.request.method as Method; }
	public clone = this.request.clone;
	public arrayBuffer = this.request.arrayBuffer;
	public blob = this.request.blob;
	public formData = this.request.formData;
	public json = this.request.json;
	public text = this.request.text;
	// public clone = () => this.request.clone();
	// public arrayBuffer = () => this.request.arrayBuffer();
	// public blob = () => this.request.blob();
	// public formData = () => this.request.formData();
	// public json = <T>(): Promise<T> => this.request.json();
	// public text = () => this.request.text();
}


export class Req<R extends ReqArgs = ReqArgs> extends BaseRequest {
	public readonly url: URL;
	public readonly cookies: Record<string, string> = {};
	public readonly headers: Record<string, string> = {};
	public readonly queryParams = <R['query']>{};

	// Injected at runtime
	public readonly pathParams = <R['path']>{};
	public route = ''; // This value gets injected at runtime by the static parsePathParams method
	public body: RequestBody = null;
	public additionalFields = <R['additional']>{};
	// Potentials names: fields, data, props, custom, customData, customFields, additionalData, additionalFields

	constructor(request: CfRequest | RequestInfo, transformParams: boolean = true) {
		super(request);
		const urlObject = new URL(this.request.url);
		this.url = urlObject;
		this.cookies = Cookie.getAll(this.request.headers as Headers);
		this.headers = Headers.getHeadersObject(this.request.headers);
		this.queryParams = Req.parseQueryParams(urlObject, transformParams);
	}

	private static parseQueryParams(url: URL, transform: boolean): Params | UnparsedParams {
		return transform ? getAllQueryParams(url, transformParam) : getAllQueryParams(url);
	}

	// These are called at runtime before passing control to the handler
	public static parsePathParams = parsePathParams;
	public static parseBody = parseBody;
}


// const A = new Req<{
// 	Add: number
// }>(new Request('dd'));
// console.log(A.additionalFields);
//
