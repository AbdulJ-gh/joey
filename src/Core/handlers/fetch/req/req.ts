import type { Request } from '@cloudflare/workers-types';
import { Headers, Cookie, type Params } from '../../../../Utilities';
import type { UnknownRecord } from '../../../types';
import type { BodyType, Method } from '../types';
import { parseBody } from './parseBody';
import { parsePathParams } from './parsePathParams';
import { normaliseRequest } from './normaliseRequest';
import { ConfigInstance } from '../../../config';
import { parseQueryParams } from './parseQueryParams';

export type ReqArgs<QP = Params, PP = Params, M = UnknownRecord> = {
	query: QP,
	path: PP,
	meta: M
}

class BaseRequest {
	public readonly request: Request = {} as Request;
	constructor(request: Request | RequestInfo) {
		this.request = normaliseRequest(request);
	}

	get bodyUsed() { return this.request.bodyUsed; }
	get cf(): CfProperties { return this.request.cf ?? {}; }
	get method(): Method { return this.request.method as Method; }
	public clone = this.request.clone;
	public arrayBuffer = this.request.arrayBuffer;
	public blob = this.request.blob();
	public formData = this.request.formData;
	public json = this.request.json;
	public text = this.request.text;
}


export class Req<R extends ReqArgs = ReqArgs> extends BaseRequest {
	public readonly url: URL;
	public readonly cookies: Record<string, string> = {};
	public readonly headers: Record<string, string> = {};
	public readonly queryParams = <R['query']>{};

	// Injected at runtime
	public readonly pathParams = <R['path']>{};
	public readonly route = '';
	public body: BodyType = null;

	// User defined
	public meta = <R['meta']>{};

	constructor(request: Request|RequestInfo, transformQuery?: boolean) {
		super(request);
		const urlObject = new URL(this.request.url);
		const transform = transformQuery ?? ConfigInstance.options.transformQueryParams;
		this.url = urlObject;
		this.cookies = Cookie.getAll(this.request.headers);
		this.headers = Headers.getHeadersObject(this.request.headers);
		this.queryParams = Req.parseQueryParams(urlObject, transform);
	}

	private static parseQueryParams = parseQueryParams;
	public static parsePathParams = parsePathParams;
	public static parseBody = parseBody;
}
