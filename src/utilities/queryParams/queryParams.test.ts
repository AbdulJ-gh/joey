import test from 'ava';
import queryParams from '../queryParams';

/** Get Query Param **/
test('#getQueryParam - No matching query param', t => {
	const url = new URL('http://testurl/com?query1=param1');
	const param = queryParams.getQueryParam(url, 'query2');
	t.is(param, null);
});

test('#getQueryParam - One matching query param', t => {
	const url = new URL('http://testurl/com?query1=param1');
	const param = queryParams.getQueryParam(url, 'query1');
	t.is(param, 'param1');
});

test('#getQueryParam - URL encoding', t => {
	const url = new URL('http://testurl/com?query1=this%20is%20a%20string');
	const param = queryParams.getQueryParam(url, 'query1');
	t.is(param, 'this is a string');
});

test('#getQueryParam - Multiple matching query params', t => {
	const url = new URL('http://testurl/com?query1=param1&query1=param2');
	const param = queryParams.getQueryParam(url, 'query1');
	t.deepEqual(param, ['param1', 'param2']);
});

/** Get Query Params **/
test('#getQueryParams - No matching query param', t => {
	const url = new URL('http://testurl/com?query1=param1');
	const params = queryParams.getQueryParams(url, ['query2']);
	t.deepEqual(params, { query2: null });
});

test('#getQueryParams - One matching query param', t => {
	const url = new URL('http://testurl/com?query1=param1');
	const params = queryParams.getQueryParams(url, ['query1']);
	t.deepEqual(params, { query1: 'param1' });
});

test('#getQueryParams - URL encoding', t => {
	const url = new URL('http://testurl/com?query1=this%20is%20a%20string');
	const params = queryParams.getQueryParams(url, ['query1']);
	t.deepEqual(params, { query1: 'this is a string' });
});

test('#getQueryParams - Multiple params', t => {
	const url = new URL('http://testurl/com?query1=param1&query2=param2');
	const params = queryParams.getQueryParams(url, ['query1', 'query2']);
	t.deepEqual(params, { query1: 'param1', query2: 'param2' });
});

test('#getQueryParams - Multiple params with some null value', t => {
	const url = new URL('http://testurl/com?query1=param1&query2=param2');
	const params = queryParams.getQueryParams(url, ['query1', 'query2', 'query3']);
	t.deepEqual(params, { query1: 'param1', query2: 'param2', query3: null });
});
