import test from 'ava';
import { Res } from './res';
import { ResProperties } from './types';

const defaultProperties = {
	body: null,
	status: 200,
	headers: new Headers,
	pretty: false
};

const getResData = (res: Res): ResProperties => {
	const [body, status, headers, pretty] = [...res];
	return { body, status, headers, pretty } as ResProperties;
};

test('Res - Default properties', t => {
	const res = new Res;
	const data = getResData(res);
	t.deepEqual(data, defaultProperties);
});

test('Res - Constructed Res', t => {
	const mockBody = { hello: 'world' };
	const mockHeaders = { key: 'value1' };
	const res = new Res(mockBody, 400, mockHeaders, true);
	const { body, status, headers, pretty } = getResData(res);

	t.deepEqual(body, mockBody);
	t.is(status, 400);
	t.deepEqual(headers, new Headers(mockHeaders));
	t.is(pretty, true);
});

test('Res - prettify', t => {
	const res = new Res({ hello: 'world' });

	let { pretty } = getResData(res);
	t.is(pretty, false);

	res.prettify();
	pretty = getResData(res).pretty;
	t.is(pretty, true);

	res.prettify(false);
	pretty = getResData(res).pretty;
	t.is(pretty, false);
});

test('Res - set Body', t => {
	const res = new Res;
	const mockBody = { hello: 'world' };
	res.body(mockBody);
	const { body } = getResData(res);
	t.deepEqual(body, mockBody);
});

test('Res - set Status', t => {
	const res = new Res;
	res.status(500);
	const { status } = getResData(res);
	t.is(status, 500);
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

	res.set({ body });
	let data = getResData(res);
	t.deepEqual(data.body, body);
	t.is(data.status, defaultProperties.status);
	t.deepEqual(data.headers, defaultProperties.headers);
	t.is(data.pretty, defaultProperties.pretty);

	res.set({ body, status });
	data = getResData(res);
	t.deepEqual(data.body, body);
	t.is(data.status, 500);
	t.deepEqual(data.headers, defaultProperties.headers);
	t.is(data.pretty, defaultProperties.pretty);

	res.set({ body, status, headers });
	data = getResData(res);
	t.deepEqual(data.body, body);
	t.is(data.status, 500);
	t.deepEqual(data.headers, new Headers(headers));
	t.is(data.pretty, defaultProperties.pretty);

	res.set({ body, status, headers, pretty });
	data = getResData(res);
	t.deepEqual(data.body, body);
	t.is(data.status, 500);
	t.deepEqual(data.headers, new Headers(headers));
	t.is(data.pretty, pretty);
});


test('Res - get', t => {
	const res = new Res;
	const mockBody1 = { hello: 'world' };

	res.body(mockBody1).status(401);
	let data = getResData(res);
	t.deepEqual(data.body, res.get.body);
	t.deepEqual(res.get.body, mockBody1);
	t.is(data.status, res.get.status);
	t.is(res.get.status, 401);
	t.is(data.pretty, res.get.pretty);
	t.is(res.get.pretty, false);

	const mockBody2 = { bye: 'world' };
	res.body(mockBody2).status(200).prettify();
	data = getResData(res);
	t.deepEqual(data.body, res.get.body);
	t.deepEqual(res.get.body, mockBody2);
	t.is(data.status, res.get.status);
	t.is(res.get.status, 200);
	t.is(data.pretty, res.get.pretty);
	t.is(res.get.pretty, true);
});
