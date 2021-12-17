import test from 'ava';
import { Res } from './res';

const defaultProperties = {
	pretty: false,
	status: 200,
	body: {},
	headers: new Headers()
};

test('Default properties', t => {
	const res = new Res();
	t.is(res['pretty'], defaultProperties.pretty);
	t.is(res['status'], defaultProperties.status);
	t.deepEqual(res['body'], defaultProperties.body);
	t.deepEqual(res.headers, defaultProperties.headers);
});

test('Constructed Res', t => {
	const body = { hello: 'world' };
	const status = 400;
	const headers = { key: 'value1' };
	const res = new Res(body, status, headers);
	t.is(res['status'], 400);
	t.deepEqual(res['body'], { hello: 'world' });
	t.deepEqual(res.headers, new Headers(headers));
});

test('Set prettify', t => {
	const res = new Res({ hello: 'world' });
	res.prettify();
	t.is(res['pretty'], true);
});

test('setBody', t => {
	const res = new Res();
	const body = { hello: 'world' };
	res.setBody(body);
	t.deepEqual(res['body'], body);
});

test('setStatus', t => {
	const res = new Res();
	res.setStatus(500);
	t.is(res['status'], 500);
});

test('setHeaders', t => {
	const res = new Res();
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

test('set', t => {
	const res = new Res();
	const body = { hello: 'world' };
	const status = 400;
	const headers = { key: 'value1' };

	res.set(body);
	t.deepEqual(res['body'], body);
	t.is(res['status'], defaultProperties.status);
	t.deepEqual(res.headers, defaultProperties.headers);

	res.set(body, status);
	t.deepEqual(res['body'], body);
	t.is(res['status'], status);
	t.deepEqual(res.headers, defaultProperties.headers);

	res.set(body, status, headers);
	t.deepEqual(res['body'], body);
	t.is(res['status'], status);
	t.deepEqual(res.headers, new Headers(headers));
});
