import test from 'ava';
import { getQueryParams } from '../getQueryParams';

test('#getQueryParams - No matching query param', t => {
	const url = new URL('https://example.com?query1=param1');
	const params = getQueryParams(url, ['query2']);
	t.deepEqual(params, { query2: null });
});

test('#getQueryParams - One matching query param', t => {
	const url = new URL('https://example.com?query1=param1');
	const params = getQueryParams(url, ['query1']);
	t.deepEqual(params, { query1: 'param1' });
});

test('#getQueryParams - URL encoding', t => {
	const url = new URL('https://example.com?query1=this%20is%20a%20string');
	const params = getQueryParams(url, ['query1']);
	t.deepEqual(params, { query1: 'this is a string' });
});

test('#getQueryParams - Multiple params', t => {
	const url = new URL('https://example.com?query1=param1&query2=param2');
	const params = getQueryParams(url, ['query1', 'query2']);
	t.deepEqual(params, { query1: 'param1', query2: 'param2' });
});

test('#getQueryParams - Multiple params with some null value', t => {
	const url = new URL('https://example.com?query1=param1&query2=param2');
	const params = getQueryParams(url, ['query1', 'query2', 'query3']);
	t.deepEqual(params, { query1: 'param1', query2: 'param2', query3: null });
});

test('#getQueryParams - Multiple same params', t => {
	const url = new URL('https://example.com?query1=param1&query1=param2');
	const params = getQueryParams(url, ['query1', 'query2']);
	t.deepEqual(params, { query1: ['param1', 'param2'], query2: null });
});
