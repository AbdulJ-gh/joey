import type { AuthData } from '../Authenticator';
import type { PathParams, RequestBody, BodyType } from './types';
import { getAllQueryParams, type QueryParams } from '../../Utilities/queryParams/queryParams';

export interface Req extends Omit<Request, 'body'> {
	[key: string]: unknown
}


export class Req {
	public auth: AuthData = null;
	public URL: URL;
	public pathParams: PathParams = {};
	public queryParams: QueryParams = {};
	public body: RequestBody = null;

	constructor(request: Request) {
		Object.assign(this, request);
		this.URL = new URL(request.url);
	}

	private static pathHasParams(absolutePath: string): boolean {
		return absolutePath?.includes('/:') || false;
	}

	public static async extractBody(req: Req, type: BodyType): Promise<void> {
		const ct = req.headers.get('Content-Type');
		if (req.method !== 'GET') {
			switch (type) {
				case 'plaintext':
					req.body = await req.text(); break;
				case 'json':
					req.body = await req.json(); break;
				case 'xForm':
				case 'multiForm':
					req.body = await req.formData(); break;
				case 'blob':
					req.body = await req.blob(); break;
				case 'buffer':
					req.body = await req.arrayBuffer(); break;
				case null:
					req.body = null; break;
				default:
					break;
			}
		}
	}

	public static getPathParams(req: Req, absolutePath: string): void {
		const path = req.URL.pathname;

		if (this.pathHasParams(absolutePath)) {
			const params: Record<string, string> = {};
			const pathSplit = path.split('/');
			const paramPathSplit = absolutePath.split('/');

			for (let i = 0; i < pathSplit.length; i++) {
				if (paramPathSplit[i].startsWith(':')) {
					params[paramPathSplit[i].slice(1)] = pathSplit[i];
				}
			}

			req.pathParams = params;
		}
	}

	public static getQueryParams(req: Req): void {
		req.queryParams = getAllQueryParams(req.URL);
	}
}


// Might need to send boundary with for multi-part/form-data Responses
// x-www-form-urlencoded and multi-part/form-data can both be parsed with await res.form()
// x-www-form-urlencoded should be able to be parsed await res.text() then URLSearchParams, but nor sure if it's worth it
// Both types have the same "get, set, append, getAll, etc..." methods QueryParams. Maybe make getting a JS object from these a single utility. `transformStructuredData
// Headers does not have the getAll method
//
// I should try and decode the body from the content-type as much as possible.
// However, I don't know if content-type will always be set or correct
// Think about what kinds of `extractBody` options I want.
// 			-- boolean value, use content-type only, and no transform us null
//	 		-- specific values + content-type option ?
//
// How do the handler know what type the body object has been parsed as. No type checking here?
//
