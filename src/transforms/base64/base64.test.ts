import test from 'ava';
import Base64 from './base64';
import ByteArray from '../byteArray';

test('Base64 - Encode', t => {
	const b64 = Base64.encode(
		'`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@£$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?`¡€#¢∞§¶•ªº–≠œ∑´®†¥¨^øπ“‘«åß∂ƒ©˙∆˚¬…æΩ≈ç√∫~µ≤≥÷Ÿ⁄™‹›ﬁﬂ‡°·‚—±Œ„‰ÂÊÁËÈØ∏”’»ÅÍÎÏÌÓÔÒÚÆÛÙÇ◊ıˆ˜¯˘¿ '
	);
	t.is(
		b64,
		'YDEyMzQ1Njc4OTAtPXF3ZXJ0eXVpb3BbXVxhc2RmZ2hqa2w7J3p4Y3Zibm0sLi9+IUDCoyQlXiYqKClfK1FXRVJUWVVJT1B7fXxBU0RGR0hKS0w6IlpYQ1ZCTk08Pj9gwqHigqwjwqLiiJ7Cp8K24oCiwqrCuuKAk+KJoMWT4oiRwrTCruKAoMKlwqhew7jPgOKAnOKAmMKrw6XDn+KIgsaSwqnLmeKIhsuawqzigKbDps6p4omIw6fiiJriiKt+wrXiiaTiiaXDt8W44oGE4oSi4oC54oC676yB76yC4oChwrDCt+KAmuKAlMKxxZLigJ7igLDDgsOKw4HDi8OIw5jiiI/igJ3igJnCu8OFw43DjsOPw4zDk8OU76O/w5LDmsOGw5vDmcOH4peKxLHLhsucwq/LmMK/IA=='
	);
});

test('Base64 - Decode', t => {
	const b64 = Base64.decode(
		'YDEyMzQ1Njc4OTAtPXF3ZXJ0eXVpb3BbXVxhc2RmZ2hqa2w7J3p4Y3Zibm0sLi9+IUDCoyQlXiYqKClfK1FXRVJUWVVJT1B7fXxBU0RGR0hKS0w6IlpYQ1ZCTk08Pj9gwqHigqwjwqLiiJ7Cp8K24oCiwqrCuuKAk+KJoMWT4oiRwrTCruKAoMKlwqhew7jPgOKAnOKAmMKrw6XDn+KIgsaSwqnLmeKIhsuawqzigKbDps6p4omIw6fiiJriiKt+wrXiiaTiiaXDt8W44oGE4oSi4oC54oC676yB76yC4oChwrDCt+KAmuKAlMKxxZLigJ7igLDDgsOKw4HDi8OIw5jiiI/igJ3igJnCu8OFw43DjsOPw4zDk8OU76O/w5LDmsOGw5vDmcOH4peKxLHLhsucwq/LmMK/IA=='
	);
	t.is(
		b64,
		'`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@£$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?`¡€#¢∞§¶•ªº–≠œ∑´®†¥¨^øπ“‘«åß∂ƒ©˙∆˚¬…æΩ≈ç√∫~µ≤≥÷Ÿ⁄™‹›ﬁﬂ‡°·‚—±Œ„‰ÂÊÁËÈØ∏”’»ÅÍÎÏÌÓÔÒÚÆÛÙÇ◊ıˆ˜¯˘¿ '
	);
});

test('Base64 - Encode URI safe', t => {
	const b64 = Base64.encodeUriSafe(
		'`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@£$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?`¡€#¢∞§¶•ªº–≠œ∑´®†¥¨^øπ“‘«åß∂ƒ©˙∆˚¬…æΩ≈ç√∫~µ≤≥÷Ÿ⁄™‹›ﬁﬂ‡°·‚—±Œ„‰ÂÊÁËÈØ∏”’»ÅÍÎÏÌÓÔÒÚÆÛÙÇ◊ıˆ˜¯˘¿ '
	);
	t.is(
		b64,
		'YDEyMzQ1Njc4OTAtPXF3ZXJ0eXVpb3BbXVxhc2RmZ2hqa2w7J3p4Y3Zibm0sLi9-IUDCoyQlXiYqKClfK1FXRVJUWVVJT1B7fXxBU0RGR0hKS0w6IlpYQ1ZCTk08Pj9gwqHigqwjwqLiiJ7Cp8K24oCiwqrCuuKAk-KJoMWT4oiRwrTCruKAoMKlwqhew7jPgOKAnOKAmMKrw6XDn-KIgsaSwqnLmeKIhsuawqzigKbDps6p4omIw6fiiJriiKt-wrXiiaTiiaXDt8W44oGE4oSi4oC54oC676yB76yC4oChwrDCt-KAmuKAlMKxxZLigJ7igLDDgsOKw4HDi8OIw5jiiI_igJ3igJnCu8OFw43DjsOPw4zDk8OU76O_w5LDmsOGw5vDmcOH4peKxLHLhsucwq_LmMK_IA'
	);
});

test('Base64 - Decode URI safe', t => {
	const b64 = Base64.decodeUriSafe(
		'YDEyMzQ1Njc4OTAtPXF3ZXJ0eXVpb3BbXVxhc2RmZ2hqa2w7J3p4Y3Zibm0sLi9-IUDCoyQlXiYqKClfK1FXRVJUWVVJT1B7fXxBU0RGR0hKS0w6IlpYQ1ZCTk08Pj9gwqHigqwjwqLiiJ7Cp8K24oCiwqrCuuKAk-KJoMWT4oiRwrTCruKAoMKlwqhew7jPgOKAnOKAmMKrw6XDn-KIgsaSwqnLmeKIhsuawqzigKbDps6p4omIw6fiiJriiKt-wrXiiaTiiaXDt8W44oGE4oSi4oC54oC676yB76yC4oChwrDCt-KAmuKAlMKxxZLigJ7igLDDgsOKw4HDi8OIw5jiiI_igJ3igJnCu8OFw43DjsOPw4zDk8OU76O_w5LDmsOGw5vDmcOH4peKxLHLhsucwq_LmMK_IA'
	);
	t.is(
		b64,
		'`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@£$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?`¡€#¢∞§¶•ªº–≠œ∑´®†¥¨^øπ“‘«åß∂ƒ©˙∆˚¬…æΩ≈ç√∫~µ≤≥÷Ÿ⁄™‹›ﬁﬂ‡°·‚—±Œ„‰ÂÊÁËÈØ∏”’»ÅÍÎÏÌÓÔÒÚÆÛÙÇ◊ıˆ˜¯˘¿ '
	);
});

test('Base64 - From ByteArray', t => {
	const bytes = ByteArray.fromString('This is a string');
	t.is(Base64.fromByteArray(bytes), Base64.encode('This is a string'));
});

test('Base64 - From ByteArray - URI safe', t => {
	const bytes = ByteArray.fromString('This is a string');
	t.is(Base64.fromByteArray(bytes, true), Base64.encodeUriSafe('This is a string'));
});

test('Base64 - To ByteArray', t => {
	const bytes = Base64.toByteArray('VGhpcyBpcyBhIHN0cmluZw==');
	t.deepEqual(Array.from(bytes), Array.from(ByteArray.fromString('This is a string')));
});

test('Base64 - To ByteArray - URI safe', t => {
	const bytes = Base64.toByteArray('VGhpcyBpcyBhIHN0cmluZw', true);
	t.deepEqual(Array.from(bytes), Array.from(ByteArray.fromString('This is a string')));
});

test('Base64 - From ArrayBuffer', t => {
	const buffer = ByteArray.fromString('This is a string').buffer;
	t.is(Base64.fromArrayBuffer(buffer), Base64.encode('This is a string'));
});

test('Base64 - From ArrayBuffer - URI safe', t => {
	const bytes = ByteArray.fromString('This is a string').buffer;
	t.is(Base64.fromArrayBuffer(bytes, true), Base64.encodeUriSafe('This is a string'));
});

test('Base64 - To ArrayBuffer', t => {
	const buffer = Base64.toArrayBuffer('VGhpcyBpcyBhIHN0cmluZw==');
	t.deepEqual(Array.from(ByteArray.fromBuffer(buffer)), Array.from(ByteArray.fromString('This is a string')));
});

test('Base64 - To ArrayBuffer - URI safe', t => {
	const buffer = Base64.toArrayBuffer('VGhpcyBpcyBhIHN0cmluZw', true);
	t.deepEqual(Array.from(ByteArray.fromBuffer(buffer)), Array.from(ByteArray.fromString('This is a string')));
});

// TODO: Make test util to compare arrays and array likes object (BytesArrays, ArrayBuffers)
