import test from 'ava';
import byteArray from './byteArray';
import bytesAreEqual from '../../../testUtils/compareArrayLikeBytes';
import { longString, longArray } from '../../../testUtils/testValues';

const [byteArray1, byteArray2, byteArray3] = [
	byteArray.fromString('abcde'),
	byteArray.fromString('fghij'),
	byteArray.fromString('klmno')
];

test('ByteArray - fromString', t => {
	const bytes = byteArray.fromString(longString);
	t.true(bytesAreEqual(bytes, longArray));
});

test('ByteArray - toString', t => {
	const string = byteArray.toString(new Uint8Array(longArray));
	t.deepEqual(string, longString);
});

test('ByteArray - fromBuffer', t => {
	const bytes = byteArray.fromBuffer(byteArray.fromString('abcd').buffer);
	t.true(bytesAreEqual(bytes, [97, 98, 99, 100]));
});

test('ByteArray - toBuffer', t => {
	const bytes = byteArray.fromString('abcd');
	const buffer = byteArray.toBuffer(bytes);
	t.deepEqual(buffer, bytes.buffer);
});

test('ByteArray - join - No items', t => {
	t.deepEqual(byteArray.join(byteArray1), byteArray1);
});

test('ByteArray - join - One item', t => {
	t.deepEqual(byteArray.join(byteArray1, byteArray2), byteArray.fromString('abcdefghij'));
});

test('ByteArray - join - Multiple items', t => {
	t.deepEqual(byteArray.join(byteArray1, byteArray2, byteArray3), byteArray.fromString('abcdefghijklmno'));
});
