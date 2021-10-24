import test from 'ava';
import Res from '../Res';
import Responder from './responder';

test('Send JSON', async t => {
	const res = new Res({ hello: 'world' }, 201, { key: 'value' });
	const response = new Responder(res).send();
	const json: any = await response.json<JSON>();

	t.is(json.pretty, false);
	t.is(json.bodyType, 'json');
	t.is(json.status, 201);
	t.deepEqual(json.headers, {});
	t.deepEqual(json.body, { hello: 'world' });
});
