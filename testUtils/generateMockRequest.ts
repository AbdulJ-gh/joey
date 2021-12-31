import { Method } from '../src/Routing/Router';

// Path must be blank or start with / for this util
export function generateMockRequest(path = '', method: Method = 'GET') {
	return new Request(`https://baseMockEvent.com${path}`, { method });
}
