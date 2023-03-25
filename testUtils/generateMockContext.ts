import { Res, Req } from '../src/Core';

// TODO: Remove or update
export function generateMockContext(
	req = new Req(new Request('')),
	res = new Res(),
	next: () => Promise<unknown> | unknown = () => null,
	event = {} as FetchEvent
) {
	return { req, res, next, event };
}
