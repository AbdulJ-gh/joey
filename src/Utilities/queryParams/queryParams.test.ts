import test from 'ava';
import { getQueryParam, getQueryParams, getAllQueryParams, transformParam } from '../queryParams';

/** Get Query Param **/
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

/** Get Query Params **/
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

/** Get All Query Params **/
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
	const url = new URL('https://example.com?query1=param1&query2=param2');
	const params = getAllQueryParams(url);
	t.deepEqual(params, { query1: 'param1', query2: 'param2' });
});

test('##getAllQueryParams - Mixed single and multiple values', t => {
	const url = new URL('https://example.com?query1=param1&query1=param2&query2=param3');
	const params = getAllQueryParams(url);
	t.deepEqual(params, { query1: ['param1', 'param2'], query2: 'param3' });
});


/** Transform Param **/
test('#transformParam - boolean', t => {
	t.true(transformParam('true'));
	t.true(transformParam('TRUE'));
	t.false(transformParam('false'));
	t.false(transformParam('FALSE'));
	t.is(transformParam('0'), 0);
	t.is(transformParam('1'), 1);
});

test('#transformParam - null', t => {
	t.is(transformParam('null'), null);
});

test('#transformParam - integer', t => {
	t.is(transformParam('123'), 123);
	t.is(transformParam('-123'), -123);
	t.is(transformParam('+123'), 123);
	t.is(transformParam('1+23'), '1+23');
	t.is(transformParam('1.23'), '1.23');
});

test('#transformParam - safe integer range', t => {
	// 9007199254740991 to -9007199254740991
	t.is(transformParam('9007199254740991'), 9007199254740991);
	t.is(transformParam('+9007199254740991'), 9007199254740991);
	t.is(transformParam('-9007199254740991'), -9007199254740991);
	t.is(transformParam('9007199254740992'), '9007199254740992');
	t.is(transformParam('-9007199254740992'), '-9007199254740992');
});


test('#transformParam - string', t => {
	t.is(transformParam('abc'), 'abc');
	t.is(transformParam('abc'), 'abc');
	t.is(transformParam('abc'), 'abc');
});
