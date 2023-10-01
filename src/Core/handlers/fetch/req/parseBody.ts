import type { Request } from '@cloudflare/workers-types';
import type { Req } from './req';
import { ConfigInstance } from '../../../config';
import { HandlerBodyType } from '../types';

export async function parseBody(req: Req): Promise<HandlerBodyType> {
	const { parseBody, cloneBody, contentHeaderParseMap } = ConfigInstance.options;

	if (!parseBody || req.method === 'GET') { return null; }

	let reqInstance: Request = req as unknown as Request;
	if (cloneBody) { reqInstance = await req.clone(); }
	// TODO - check - ^^ TS says await has no affect on this expression but I think that's not true

	let parseMethod: HandlerBodyType;
	if (parseBody === 'header') {
		const contentHeader = req.headers['content-type'].toLowerCase();
		const matcher = contentHeaderParseMap.matchers.find(matcher => {
			const query = matcher.query.toLowerCase();
			return matcher.matcher === 'exclusive' ? query === contentHeader : contentHeader.includes(query);
		});
		parseMethod = matcher?.bodyType ?? null;
	} else {
		parseMethod = parseBody;
	}

	switch (parseMethod) {
		case 'plaintext':
			req.body = await reqInstance.text();
			break;
		case 'json':
			req.body = await reqInstance.json();
			break;
		case 'formData':
			req.body = await reqInstance.formData();
			break; // TODO - Convert to object?
		case 'urlEncodedFormData':
			req.body = new URLSearchParams(await reqInstance.text());
			break; // TODO - convert to object?
		case 'arrayBuffer':
			req.body = await reqInstance.arrayBuffer();
			break;
		case 'blob':
			req.body = await reqInstance.blob();
			break;
		default:
			break;
	}

	return parseMethod;
}
