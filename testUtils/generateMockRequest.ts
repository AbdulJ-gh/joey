import { JsonBody } from '../src/Routing/Res';
import { Method } from '../src/Routing/Router';

// Path must be blank or start with / for this util
export function generateMockRequest(
	path = '',
	method: Method = 'GET',
	body: JsonBody | string | null = null,
	headers: HeadersInit = {}
) {
	let reqBody;

	if (body) {
		if (typeof body === 'string') {
			reqBody = body;
		} else {
			reqBody = JSON.stringify(body);
		}
	} else {
		reqBody = body;
	}

	return new Request(`https://baseMockEvent.com${path}`, {
		method,
		body: reqBody,
		headers
	});
}
