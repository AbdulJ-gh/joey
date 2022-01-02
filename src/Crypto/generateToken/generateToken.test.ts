import test from 'ava';
import { generateToken } from './generateToken';

test('Generate token - too small', t => {
	t.throws(() => generateToken(7));
});

test('Generate token - Odd number', t => {
	const odd = generateToken(9);
	t.is(typeof odd, 'string');
	t.is(odd.length, 9);
});


test('Generate token - even number', t => {
	const even = generateToken(32);
	t.is(typeof even, 'string');
	t.is(even.length, 32);
});
