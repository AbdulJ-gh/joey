import test from 'ava';
import { getHeadersObject, getHeadersInstance } from '../transformHeadersType';

test('transformHeadersType - getHeadersObject - Headers type', t => {
	const headers = new Headers({ a: '100' });
	t.deepEqual(getHeadersObject(headers), { a: '100' });
});

test('transformHeadersType - getHeaderObject - Matrix type', t => {
	const headers: [key: string, value: string][] = [['b', '200']];
	t.deepEqual(getHeadersObject(headers), { b: '200' });
});

test('transformHeadersType -getHeaderObject - Object type', t => {
	const headers = { c: '300' };
	t.deepEqual(getHeadersObject(headers), { c: '300' });
});

test('transformHeadersType - getHeadersInstance - Headers type', t => {
	const headers = new Headers({ a: '100' });
	t.deepEqual(getHeadersInstance(headers), new Headers({ a: '100' }));
});

test('transformHeadersType - getHeadersInstance - Matrix type', t => {
	const headers: [key: string, value: string][] = [['b', '200']];
	t.deepEqual(getHeadersInstance(headers), new Headers({ b: '200' }));
});

test('transformHeadersType - getHeadersInstance - Object type', t => {
	const headers = { c: '300' };
	t.deepEqual(getHeadersInstance(headers), new Headers({ c: '300' }));
});
