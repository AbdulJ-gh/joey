import test from 'ava';
import { Res, type JsonBody } from '../Res';
import { Responder } from './responder';

test('Responder - Inherits Res properties', t => {
	const res = new Res({ hello: 'world' }, 201, { someKey: 'someValue' }, true);
	const responder = new Responder(res);

	t.is(responder.get.status, 201);
	t.is(responder.get.pretty, true);
	t.deepEqual(responder.get.body, { hello: 'world' });
	t.true(responder.headers.has('someKey'));
	t.is(responder.headers.get('someKey'), 'someValue');
});


test('Responder - Send JSON', async t => {
	const jsonRes = new Res({ hello: 'world' }, 201, { someKey: 'someValue' });
	const response = new Responder(jsonRes).respond();

	t.is(response.status, 201);
	t.is(response.statusText, 'Created');
	t.true(response.headers.has('someKey'));
	t.is(response.headers.get('someKey'), 'someValue');
	t.is(response.headers.get('content-type'), 'application/json');

	const json: JsonBody = await response.json();
	t.deepEqual(json, { hello: 'world' });
});

test('Responder - Send plain test', async t => {
	const textRes = new Res('hello world', 200, { someKey: 'someValue' });
	const response = new Responder(textRes).respond();

	t.is(response.status, 200);
	t.is(response.statusText, 'OK');
	t.true(response.headers.has('someKey'));
	t.is(response.headers.get('someKey'), 'someValue');
	t.is(response.headers.get('content-type'), 'text/plain; charset=utf-8');

	const text: string = await response.text();
	t.deepEqual(text, 'hello world');
});

test('Responder - Send form data', t => {
	const formData = new FormData();
	const formRes = new Res(formData, 202, { someKey: 'someValue' });
	const response = new Responder(formRes).respond();

	t.is(response.status, 202);
	t.is(response.statusText, 'Accepted');
	t.true(response.headers.has('someKey'));
	t.is(response.headers.get('someKey'), 'someValue');
	t.is(response.headers.get('content-type'), 'multipart/form-data');

	// const form: FormData = await response.formData();
	// t.deepEqual(form, formData);
});


test('Responder - Send array buffer', async t => {
	const buffer = new ArrayBuffer(10);
	const bufferRes = new Res(buffer, 202, { someKey: 'someValue' });
	const response = new Responder(bufferRes).respond();

	t.is(response.status, 202);
	t.is(response.statusText, 'Accepted');
	t.true(response.headers.has('someKey'));
	t.is(response.headers.get('someKey'), 'someValue');
	t.is(response.headers.get('content-type'), 'application/octet-stream');

	const buf: ArrayBuffer = await response.arrayBuffer();
	t.deepEqual(buf, buffer);
});


test('Responder - Send no content', t => {
	const nullRes = new Res;
	const response = new Responder(nullRes).respond();

	t.is(response.status, 204);
	t.is(response.statusText, 'No Content');
	t.is(response.headers.get('content-type'), null);
	t.is(response.body, null);
});

test('Responder - Send no content, status initialised', t => {
	const nullRes = new Res(null, 200, { someKey: 'someValue' });
	const response = new Responder(nullRes).respond();

	t.is(response.status, 200);
	t.is(response.statusText, 'OK');
	t.true(response.headers.has('someKey'));
	t.is(response.headers.get('someKey'), 'someValue');
	t.is(response.headers.get('content-type'), null);
	t.is(response.body, null);
});

test('Responder - Send no content, status set manually', t => {
	const nullRes = new Res;
	nullRes.status(202);
	const response = new Responder(nullRes).respond();

	t.is(response.status, 202);
	t.is(response.statusText, 'Accepted');
	t.is(response.headers.get('content-type'), null);
	t.is(response.body, null);
});
