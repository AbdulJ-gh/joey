import type { DeserialisedJson, Method } from './types';
import type { QueryParams } from '../Utilities/queryParams/queryParams';
import { getAllQueryParams } from '../Utilities/queryParams';
import Path from './path';

export type UnknownRecord = Record<string, unknown>;
export type PathParams = Record<string, string | string[]>;
type RequestBody = null | string | DeserialisedJson | ArrayBuffer | Blob;
export type RequestBodyStream = null | 'plaintext' | 'json' | 'formData' | 'buffer' | 'blob';

class BaseRequest {
	public readonly request: Request;
	constructor(request: Request) { this.request = request; }
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
	public readonly queryParams: QueryParams = {};
	public readonly pathParams: PathParams = {};
	public route = '';
	public body: RequestBody = null;
	public additionalFields = <T>{}; // fields, data, props, custom, customData, customFields, additionalData, additionalFields

	constructor(request: Request) {
		super(request);
		this.url = new URL(request.url);
		this.parseCookies(request.headers);
		this.parseHeaders(request.headers);
		this.parseQueryParams();
	}

	private parseHeaders(headers: Headers): void {
		for (const [key, value] of headers.entries()) {
			this.headers[key] = value;
		}
	}

	public parseQueryParams(): void {
		const obj = getAllQueryParams(this.url);
		for (const key in obj) {
			this.queryParams[key] = obj[key];
		}
	}

	private parseCookies(headers: Headers): void {
		const string = headers.get('Cookie');
		if (string) {
			const split = string.split(';');
			for (const cookie of split) {
				const [key, value] = cookie.trim().split('=');
				this.cookies[decodeURIComponent(key)] = decodeURIComponent(value);
			}
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
					case 'formData': {
						/*
							* Limitations
							* Accepts both `application/x-www-form-urlencoded` and `multipart/form-data` content
							* Only works with string form values, no file uploads
							* */
						// Make own util, see QueryParams util - Todo
						function getData(formData: FormData) {
							const data: Record<string, string|string[]> = {};
							for (const [key, value] of formData) {
								if (!data[key]) {
									const val = formData.getAll(value as string) as string[];
									data[key] = (val.length === 1 ? val[0] : val);
								}
							}
							return data;
						}
						req.body = getData(await req.formData());
						break;
					}
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

	public static parsePathParams(req: Req, parameterisedPath: string): void {
		req.route = parameterisedPath;
		const path = req.url.pathname;

		if (Path.pathHasParams(parameterisedPath)) {
			const pathSplit = path.split('/');
			const paramPathSplit = parameterisedPath.split('/');

			for (let i = 0; i < pathSplit.length; i++) {
				if (paramPathSplit[i].startsWith(':')) {
					req.pathParams[paramPathSplit[i].slice(1)] = pathSplit[i];
				}
			}
		}
	}
}
