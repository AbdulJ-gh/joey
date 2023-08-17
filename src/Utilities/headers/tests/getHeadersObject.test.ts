import test from 'ava';
import { getHeadersObject } from '../getHeadersObject';

test('getHeadersObject - Headers type', t => {
	const headers = new Headers({ a: '100' });
	t.deepEqual(getHeadersObject(headers), { a: '100' });
});

test('getHeaderObject - Matrix type', t => {
	const headers: [key: string, value: string][] = [['b', '200']];
	t.deepEqual(getHeadersObject(headers), { b: '200' });
});

test('getHeaderObject - Object type', t => {
	const headers = { c: '300' };
	t.deepEqual(getHeadersObject(headers), { c: '300' });
});
