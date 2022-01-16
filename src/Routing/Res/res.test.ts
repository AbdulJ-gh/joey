import test from 'ava';
import { Res } from './res';

test('Res - Default properties', t => {
	const res = new Res;
	t.is(res.get.body, null);
	t.is(res.get.status, 204);
	t.is(res.get.pretty, false);
});

test('Res - Constructed Res', t => {
	const mockBody = { hello: 'world' };
	const mockHeaders = { key: 'value1' };
	const res = new Res(mockBody, 400, mockHeaders, true);

	t.deepEqual(res.get.body, mockBody);
	t.is(res.get.status, 400);
	t.deepEqual(res.headers, new Headers(mockHeaders));
	t.is(res.get.pretty, true);
});

test('Res - prettify', t => {
	const res = new Res({ hello: 'world' });

	let { pretty } = res.get;
	t.is(pretty, false);

	res.prettify();
	pretty = res.get.pretty;
	t.is(pretty, true);

	res.prettify(false);
	pretty = res.get.pretty;
	t.is(pretty, false);
});

test('Res - set Body', t => {
	const res = new Res;
	const mockBody = { hello: 'world' };
	res.body(mockBody);
	t.deepEqual(res.get.body, mockBody);
});

test('Res - set Status', t => {
	const res = new Res;
	res.status(500);
	t.is(res.get.status, 500);
});

test('Res - set Headers', t => {
	const res = new Res;
	const headers1 = { key: 'value1' }; // Type - Record<string, string>
	const headers2 = [['key', 'value2']] as [string, string][]; // Type - [key: string, value: string][]  OR  [string, string][]
	const headers3 = new Headers({ key: 'value3' }); // Type — Headers

	res.setHeaders(headers1);
	t.is(res.headers.get('key'), 'value1');

	res.setHeaders(headers2);
	t.is(res.headers.get('key'), 'value2');

	res.setHeaders(headers3);
	t.is(res.headers.get('key'), 'value3');
});

test('Res - set', t => {
	const res = new Res;
	const body = { hello: 'world' };
	const status = 500;
	const headers = { key: 'value1' };
	const pretty = true;

	res.set({ pretty });
	let data = res.get;
	t.is(data.body, null);
	t.is(data.status, 204);
	t.deepEqual(res.headers, new Headers);
	t.is(data.pretty, true);

	res.set({ pretty, body });
	data = res.get;
	t.deepEqual(data.body, body);
	t.is(data.status, 200);
	t.deepEqual(res.headers, new Headers);
	t.is(data.pretty, true);

	res.set({ pretty, body, status });
	data = res.get;
	t.deepEqual(data.body, body);
	t.is(data.status, 500);
	t.deepEqual(res.headers, new Headers);
	t.is(data.pretty, true);

	res.set({ pretty, body, status, headers });
	data = res.get;
	t.deepEqual(data.body, body);
	t.is(data.status, 500);
	t.deepEqual(res.headers, new Headers(headers));
	t.is(data.pretty, true);
});


test('Res - get', t => {
	const res = new Res;
	const mockBody1 = { hello: 'world' };

	res.body(mockBody1).status(401);
	let data = res.get;
	t.deepEqual(data.body, res.get.body);
	t.deepEqual(res.get.body, mockBody1);
	t.is(data.status, res.get.status);
	t.is(res.get.status, 401);
	t.is(data.pretty, res.get.pretty);
	t.is(res.get.pretty, false);

	const mockBody2 = { bye: 'world' };
	res.body(mockBody2).status(200).prettify();
	data = res.get;
	t.deepEqual(data.body, res.get.body);
	t.deepEqual(res.get.body, mockBody2);
	t.is(data.status, res.get.status);
	t.is(res.get.status, 200);
	t.is(data.pretty, res.get.pretty);
	t.is(res.get.pretty, true);
});
