import { Request as CfRequest } from '@cloudflare/workers-types';

export function normaliseRequest(request: CfRequest | RequestInfo): CfRequest {
	if (request instanceof CfRequest) {
		return request;
	}

	if (typeof request === 'string' || request instanceof URL) {
		return new Request(request) as unknown as CfRequest;
	}

	return <unknown>request as CfRequest;
}
