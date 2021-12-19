import test from 'ava';
import { Res } from './res';
import { Status } from '../../Utilities/general/statuses';

const defaultProperties = {
	pretty: false,
	status: 200,
	body: {},
	headers: new Headers()
};

test('Default properties', t => {
	const res = new Res();
	t.is(res['pretty'], defaultProperties.pretty);
	t.is(res['_status'], defaultProperties.status);
	t.deepEqual(res['_body'], defaultProperties.body);
	t.deepEqual(res._headers, defaultProperties.headers);
});

test('Constructed Res', t => {
	const body = { hello: 'world' };
	const status = 400;
	const headers = { key: 'value1' };
	const res = new Res(body, status, headers);
	t.is(res['_status'], 400);
	t.deepEqual(res['_body'], { hello: 'world' });
	t.deepEqual(res._headers, new Headers(headers));
});

test('Set prettify', t => {
	const res = new Res({ hello: 'world' });
	res.prettify();
	t.is(res['pretty'], true);
});

test('setBody', t => {
	const res = new Res();
	const body = { hello: 'world' };
	res.body(body);
	t.deepEqual(res['_body'], body);
});

test('setStatus', t => {
	const res = new Res();
	res.status(500);
	t.is(res['_status'], 500);
});

test('setHeaders', t => {
	const res = new Res();
	const headers1 = { key: 'value1' }; // Type - Record<string, string>
	const headers2 = [['key', 'value2']] as [string, string][]; // Type - [key: string, value: string][]  OR  [string, string][]
	const headers3 = new Headers({ key: 'value3' }); // Type - Headers

	res.headers(headers1);
	t.is(res._headers.get('key'), 'value1');

	res.headers(headers2);
	t.is(res._headers.get('key'), 'value2');

	res.headers(headers3);
	t.is(res._headers.get('key'), 'value3');
});

test('set', t => {
	const res = new Res();
	const body = { hello: 'world' };
	const status = 400;
	const headers = { key: 'value1' };

	res.set(body);
	t.deepEqual(res['_body'], body);
	t.is(res['_status'], defaultProperties.status);
	t.deepEqual(res._headers, defaultProperties.headers);

	res.set(body, status);
	t.deepEqual(res['_body'], body);
	t.is(res['_status'], status);
	t.deepEqual(res._headers, defaultProperties.headers);

	res.set(body, status, headers);
	t.deepEqual(res['_body'], body);
	t.is(res['_status'], status);
	t.deepEqual(res._headers, new Headers(headers));
});
