import test from 'ava';
import { transformParam } from './params';

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
