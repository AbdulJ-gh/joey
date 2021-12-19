import test from 'ava';
import * as Base64 from './base64';
import * as ByteArray from '../byteArray';
import bytesAreEqual from '../../../testUtils/compareArrayLikeBytes';
import { longBase64String, longString, longUriSafeBase64String } from '../../../testUtils/testValues';

test('Base64 - Encode', t => {
	const b64 = Base64.encode(longString);
	t.is(b64, longBase64String);
});

test('Base64 - Decode', t => {
	const b64 = Base64.decode(longBase64String);
	t.is(b64, longString);
});

test('Base64 - Encode URI safe', t => {
	const b64 = Base64.encodeUriSafe(longString);
	t.is(b64, longUriSafeBase64String);
});

test('Base64 - Decode URI safe', t => {
	const b64 = Base64.decodeUriSafe(longUriSafeBase64String);
	t.is(b64, longString);
});

test('Base64 - From byte array', t => {
	const b64 = Base64.fromBytes(ByteArray.fromString('This is a string'));
	t.is(b64, Base64.encode('This is a string'));
});

test('Base64 - From byte array - URI safe', t => {
	const b64 = Base64.fromBytes(ByteArray.fromString('This is a string'), true);
	t.is(b64, Base64.encodeUriSafe('This is a string'));
});

test('Base64 - To byte array', t => {
	const bytes = Base64.toBytes('VGhpcyBpcyBhIHN0cmluZw==');
	t.true(bytesAreEqual(bytes, ByteArray.fromString('This is a string')));
});

test('Base64 - To byte array - URI safe', t => {
	const bytes = Base64.toBytes('VGhpcyBpcyBhIHN0cmluZw', true);
	t.true(bytesAreEqual(bytes, ByteArray.fromString('This is a string')));
});

test('Base64 - From ArrayBuffer', t => {
	const b64 = Base64.fromBuffer(ByteArray.fromString('This is a string').buffer);
	t.is(b64, Base64.encode('This is a string'));
});

test('Base64 - From ArrayBuffer - URI safe', t => {
	const b64 = Base64.fromBuffer(ByteArray.fromString('This is a string').buffer, true);
	t.is(b64, Base64.encodeUriSafe('This is a string'));
});

test('Base64 - To ArrayBuffer', t => {
	const buffer = Base64.toBuffer('VGhpcyBpcyBhIHN0cmluZw==');
	t.true(bytesAreEqual(buffer, ByteArray.fromString('This is a string')));
});

test('Base64 - To ArrayBuffer - URI safe', t => {
	const buffer = Base64.toBuffer('VGhpcyBpcyBhIHN0cmluZw', true);
	t.true(bytesAreEqual(buffer, ByteArray.fromString('This is a string')));
});
