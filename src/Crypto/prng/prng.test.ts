import test from 'ava';
import { prng } from './prng';

test('PRNG - Returns correct length', t => {
	t.is(prng(1).length, 1);
	t.is(prng(2).length, 2);
	t.is(prng(10).length, 10);
	t.is(prng(999).length, 999);
});

test('PRNG - Different values', t => {
	t.notDeepEqual(prng(10), prng(10));
});
