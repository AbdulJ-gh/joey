import test from 'ava';
import { Res } from '../Res';
import { Responder } from './responder';

test('Send JSON', async t => {
	const res = new Res({ hello: 'world' }, 201, { someKey: 'someValue' });
	const response = new Responder(res).send() as Response;
	const json: any = await (response as Response).json();

	t.is(response.status, 201);
	t.true(response.headers.has('someKey'));
	t.is(response.headers.get('someKey'), 'someValue');
	t.deepEqual(json, { hello: 'world' });
});
