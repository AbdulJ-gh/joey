import test from 'ava';
import HexString from './hexString';
import ByteArray from '../byteArray';
import { longString, longHexString, longArray } from '../../../testUtils/testValues';
import bytesAreEqual from '../../../testUtils/compareArrayLikeBytes';

test('hexString - From bytes', t => {
	t.is(HexString.fromBytes(ByteArray.fromString(longString)), longHexString);
});

test('hexString - To bytes', t => {
	const bytes = HexString.toBytes(longHexString);
	t.true(bytesAreEqual(bytes, longArray));
});

test('hexString - From buffer', t => {
	t.is(HexString.fromBuffer(ByteArray.fromString(longString).buffer), longHexString);
});
