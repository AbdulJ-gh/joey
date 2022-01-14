import test from 'ava';
import { Req } from './req';

test('Req - Properties', t => {
	const baseRequest = new Request('https:/example.com');
	const req = new Req(baseRequest);
	req.something = { some: 'data' };
	t.is(req.auth, null);
	t.deepEqual(req.pathParams, {});
	t.deepEqual(req.something, { some: 'data' });
});

test('Req - path params', t => {
	const baseRequest = new Request(
		'https:/example.com/wasabi/cool/123/banana/icecream/sundae/flower?abcd=123#subheading#subheading2'
	);
	const req = new Req(baseRequest);
	Req.getPathParams(req, '/wasabi/:name/:id/banana/icecream/:desert/flower');
	t.deepEqual(req.pathParams, { name: 'cool', id: '123', desert: 'sundae' });
});
