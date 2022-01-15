import { Res } from '../src/Routing/Res';
import { Req } from '../src/Routing/Req';

export function generateMockContext(
	req = new Req(new Request('')),
	res = new Res,
	next: () => Promise<unknown> | unknown = () => null,
	event = {} as FetchEvent
) {
	return { req, res, next, event };
}
