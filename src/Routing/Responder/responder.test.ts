import test from 'ava';
import { Res, type JsonBody } from '../Res';
import { Responder } from './responder';

test('Responder - Send JSON', async t => {
	const res = new Res({ hello: 'world' }, 201, { someKey: 'someValue' });
	const response = new Responder(res).respond();
	const json: JsonBody = await response.json();

	t.is(response.status, 201);
	t.true(response.headers.has('someKey'));
	t.is(response.headers.get('someKey'), 'someValue');
	t.deepEqual(json, { hello: 'world' });
});
