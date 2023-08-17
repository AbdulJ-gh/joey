import test from 'ava';
import { getHeadersInstance } from '../getHeadersInstance';


test('getHeadersInstance - Headers type', t => {
	const headers = new Headers({ a: '100' });
	t.deepEqual(getHeadersInstance(headers), new Headers({ a: '100' }));
});

test('getHeadersInstance - Matrix type', t => {
	const headers: [key: string, value: string][] = [['b', '200']];
	t.deepEqual(getHeadersInstance(headers), new Headers({ b: '200' }));
});

test('getHeadersInstance - Object type', t => {
	const headers = { c: '300' };
	t.deepEqual(getHeadersInstance(headers), new Headers({ c: '300' }));
});
