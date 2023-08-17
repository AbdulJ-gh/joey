import test from 'ava';
import { getAllQueryParams } from '../getAllQueryParams';

test('#getAllQueryParams - No query params', t => {
	const url = new URL('https://example.com');
	const params = getAllQueryParams(url);
	t.deepEqual(params, {});
});

test('#getAllQueryParams - Single value', t => {
	const url = new URL('https://example.com?query1=param1');
	const params = getAllQueryParams(url);
	t.deepEqual(params, { query1: 'param1' });
});

test('##getAllQueryParams - Multiple values', t => {
	const url = new URL('https://example.com?query1=param1&query1=param2');
	const params = getAllQueryParams(url);
	t.deepEqual(params, { query1: ['param1', 'param2'] });
});

test('##getAllQueryParams - URL encoding', t => {
	const url = new URL('https://example.com?query1=this%20is%20a%20string');
	const params = getAllQueryParams(url);
	t.deepEqual(params, { query1: 'this is a string' });
});

test('##getAllQueryParams - Multiple params', t => {
	const url = new URL('https://example.com?query1=100&query2=param2');
	const params = getAllQueryParams(url);
	t.deepEqual(params, { query1: '100', query2: 'param2' });
});

test('##getAllQueryParams - Mixed single and multiple values', t => {
	const url = new URL('https://example.com?query1=param1&query1=param2&query2=param3');
	const params = getAllQueryParams(url);
	t.deepEqual(params, { query1: ['param1', 'param2'], query2: 'param3' });
});
