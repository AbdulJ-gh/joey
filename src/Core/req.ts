import type { DeserialisedJson, Method } from './types';
import { getAllQueryParams } from '../Utilities/queryParams';
import { cookie } from '../Utilities/headers/';
import { getFormData } from '../Utilities/formData';
import Path from './path';
import { Param, ParamsRecord, transformParam, transformParamsObject } from '../Transforms/params';

export type UnknownRecord = Record<string, unknown>;

type RequestBody = null | string | DeserialisedJson | ArrayBuffer | Blob;
export type RequestBodyStream = null | 'plaintext' | 'json' | 'formData' | 'buffer' | 'blob';

class BaseRequest {
	constructor(public readonly request: Request) {}
	get bodyUsed() { return this.request.bodyUsed; }
	get cf(): IncomingRequestCfProperties { return this.request.cf as IncomingRequestCfProperties; }
	get method(): Method { return this.request.method as Method; }
	get clone() { return () => this.request.clone(); }
	get arrayBuffer(): () => Promise<ArrayBuffer> { return () => this.request.arrayBuffer(); }
	get blob(): () => Promise<Blob> { return () => this.request.blob(); }
	get formData(): () => Promise<FormData> { return () => this.request.formData(); }
	get json(): <T>() => Promise<T> { return () => this.request.json(); }
	get text(): () => Promise<string> { return () => this.request.text(); }
}

export class Req<T = UnknownRecord> extends BaseRequest {
	public readonly url: URL;
	public readonly cookies: Record<string, string> = {};
	public readonly headers: Record<string, string> = {};
	public readonly queryParams: ParamsRecord = {};
	public readonly pathParams: ParamsRecord = {};
	public route = ''; // This value gets injected at runtime by the static parsePathParams method
	public body: RequestBody = null;
	public additionalFields = <T>{}; // fields, data, props, custom, customData, customFields, additionalData, additionalFields

	constructor(request: Request) {
		super(request);
		this.url = new URL(request.url);
		this.cookies = cookie.getAll(request.headers);
		this.parseHeaders(request.headers);
		this.queryParams = transformParamsObject(getAllQueryParams(this.url));
	}

	public get cookie() {
		return {
			get: (name: string): string | null => {
				return cookie.get(this.request.headers, name);
			},
			getAll: () => {
				return cookie.getAll(this.request.headers);
			}
		};
	}

	private parseHeaders(headers: Headers): void {
		for (const [key, value] of headers.entries()) {
			this.headers[key] = value;
		}
	}

	public static async parseBody(req: Req, type: RequestBodyStream): Promise<void> {
		try {
			// if (req.method !== 'GET' || req.method !== 'HEAD') {
			if (req.method !== 'GET') {
				switch (type) {
					case 'plaintext':
						req.body = await req.text();
						break;
					case 'json':
						req.body = await req.json();
						break;
					case 'formData':
						req.body = getFormData(await req.formData());
						break;
					case 'blob':
						req.body = await req.blob();
						break;
					case 'buffer':
						req.body = await req.arrayBuffer();
						break;
					case null:
					default:
						req.body = null;
						break;
				}
			}
		} catch {
			req.body = null;
		}
	}

	// This needs to be static so that parameterisedPath can be identified from the ResolvedHandler
	public static parsePathParams(req: Req, parameterisedPath: string): void {
		req.route = parameterisedPath;
		const path = req.url.pathname;

		// TODO - Make in to own util and add tests
		if (Path.pathHasParams(parameterisedPath)) {
			const pathSplit = path.split('/');
			const paramPathSplit = parameterisedPath.split('/');

			for (let i = 0; i < pathSplit.length; i++) {
				if (paramPathSplit[i].startsWith(':')) {
					const param = paramPathSplit[i].slice(1);
					if (req.pathParams[param] === undefined) {
						req.pathParams[param] = transformParam(pathSplit[i]);
					} else if (!Array.isArray(req.pathParams[param])) {
						req.pathParams[param] = [req.pathParams[param] as Param, transformParam(pathSplit[i])];
					} else {
						(req.pathParams[param] as Param[]).push(transformParam(pathSplit[i]));
					}
				}
			}
		}
	}
}
