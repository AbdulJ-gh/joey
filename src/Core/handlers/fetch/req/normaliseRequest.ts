import { Request } from '@cloudflare/workers-types';

export function normaliseRequest(request: Request | RequestInfo): Request {
	if (request instanceof Request) {
		return request;
	}

	if (typeof request === 'string' || request instanceof URL) {
		return new Request(request);
	}

	return request as unknown as Request;
}
