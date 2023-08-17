import test from 'ava';
import { getQueryParam } from '../getQueryParam';

test('#getQueryParam - No matching query param', t => {
	const url = new URL('https://example.com?query1=param1');
	const param = getQueryParam(url, 'query2');
	t.is(param, null);
});

test('#getQueryParam - One matching query param', t => {
	const url = new URL('https://example.com?query1=param1');
	const param = getQueryParam(url, 'query1');
	t.is(param, 'param1');
});

test('#getQueryParam - URL encoding', t => {
	const url = new URL('https://example.com?query1=this%20is%20a%20string');
	const param = getQueryParam(url, 'query1');
	t.is(param, 'this is a string');
});

test('#getQueryParam - Multiple matching query params', t => {
	const url = new URL('https://example.com?query1=param1&query1=param2');
	const param = getQueryParam(url, 'query1');
	t.deepEqual(param, ['param1', 'param2']);
});
