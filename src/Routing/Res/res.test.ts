import test from 'ava';
import { Res } from './res';

const defaultProperties = {
	pretty: false,
	status: 200,
	body: null,
	headers: new Headers
};

test('Res - Default properties', t => {
	const res = new Res;
	t.is(res.pretty, defaultProperties.pretty);
	t.is(res.status, defaultProperties.status);
	t.deepEqual(res.body, defaultProperties.body);
	t.deepEqual(res.headers, defaultProperties.headers);
});

test('Res - Constructed Res', t => {
	const body = { hello: 'world' };
	const headers = { key: 'value1' };
	const res = new Res(body, 400, headers, true);
	t.is(res.status, 400);
	t.deepEqual(res.body, { hello: 'world' });
	t.deepEqual(res.headers, new Headers(headers));
	t.is(res.pretty, true);
});

test('Res - prettify', t => {
	const res = new Res({ hello: 'world' });
	t.is(res.pretty, false);
	res.prettify();
	t.is(res.pretty, true);
	res.prettify(false);
	t.is(res.pretty, false);
});

test('Res - set Body', t => {
	const res = new Res;
	const body = { hello: 'world' };
	res.body = body;
	t.deepEqual(res.body, body);
});

test('Res - set Status', t => {
	const res = new Res;
	res.status = 500;
	t.is(res.status, 500);
});

test('Res - set Headers', t => {
	const res = new Res;
	const headers1 = { key: 'value1' }; // Type - Record<string, string>
	const headers2 = [['key', 'value2']] as [string, string][]; // Type - [key: string, value: string][]  OR  [string, string][]
	const headers3 = new Headers({ key: 'value3' }); // Type - Headers

	res.headers = new Headers(headers1);
	t.is(res.headers.get('key'), 'value1');

	res.headers = new Headers(headers2);
	t.is(res.headers.get('key'), 'value2');

	res.headers = new Headers(headers3);
	t.is(res.headers.get('key'), 'value3');
});

test('Res - setBody', t => {
	const res = new Res;
	const body = { hello: 'world' };
	res.setBody(body);
	t.deepEqual(res.body, body);
});

test('Res - setStatus', t => {
	const res = new Res;
	res.setStatus(500);
	t.is(res.status, 500);
});

test('Res - setHeaders', t => {
	const res = new Res;
	const headers1 = { key: 'value1' }; // Type - Record<string, string>
	const headers2 = [['key', 'value2']] as [string, string][]; // Type - [key: string, value: string][]  OR  [string, string][]
	const headers3 = new Headers({ key: 'value3' }); // Type - Headers

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
	const status = 400;
	const headers = { key: 'value1' };

	res.set({ body });
	t.deepEqual(res.body, body);
	t.is(res.status, defaultProperties.status);
	t.deepEqual(res.headers, defaultProperties.headers);

	res.set({ body, status });
	t.deepEqual(res.body, body);
	t.is(res.status, status);
	t.deepEqual(res.headers, defaultProperties.headers);

	res.set({ body, status, headers });
	t.deepEqual(res.body, body);
	t.is(res.status, status);
	t.deepEqual(res.headers, new Headers(headers));
});
