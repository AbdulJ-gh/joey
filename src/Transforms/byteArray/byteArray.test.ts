import test from 'ava';
import * as ByteArray from './byteArray';
import bytesAreEqual from '../../../testUtils/compareArrayLikeBytes';
import { longString, longArray } from '../../../testUtils/testValues';

const [byteArray1, byteArray2, byteArray3] = [
	ByteArray.fromString('abcde'),
	ByteArray.fromString('fghij'),
	ByteArray.fromString('klmno')
];

test('ByteArray - fromString', t => {
	const bytes = ByteArray.fromString(longString);
	t.true(bytesAreEqual(bytes, longArray));
});

test('ByteArray - toString', t => {
	const string = ByteArray.toString(new Uint8Array(longArray));
	t.deepEqual(string, longString);
});

test('ByteArray - fromBuffer', t => {
	const bytes = ByteArray.fromBuffer(ByteArray.fromString('abcd').buffer);
	t.true(bytesAreEqual(bytes, [97, 98, 99, 100]));
});

test('ByteArray - toBuffer', t => {
	const bytes = ByteArray.fromString('abcd');
	const buffer = ByteArray.toBuffer(bytes);
	t.deepEqual(buffer, bytes.buffer);
});

test('ByteArray - join - No items', t => {
	t.deepEqual(ByteArray.join(byteArray1), byteArray1);
});

test('ByteArray - join - One item', t => {
	t.deepEqual(ByteArray.join(byteArray1, byteArray2), ByteArray.fromString('abcdefghij'));
});

test('ByteArray - join - Multiple items', t => {
	t.deepEqual(ByteArray.join(byteArray1, byteArray2, byteArray3), ByteArray.fromString('abcdefghijklmno'));
});
