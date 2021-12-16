import test from 'ava';
import byteArray from './byteArray';

// Note: The `\` escape character gets printed in the test output on test failure, but is not included in the actual output, as can be seen by logging the byteArray.toString method

const longString =
	'`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@£$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?`¡€#¢∞§¶•ªº–≠œ∑´®†¥¨^øπ“‘«åß∂ƒ©˙∆˚¬…æΩ≈ç√∫~µ≤≥÷Ÿ⁄™‹›ﬁﬂ‡°·‚—±Œ„‰ÂÊÁËÈØ∏”’»ÅÍÎÏÌÓÔÒÚÆÛÙÇ◊ıˆ˜¯˘¿ ';

const longArray = [
	96, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 45, 61, 113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 91, 93, 92,
	97, 115, 100, 102, 103, 104, 106, 107, 108, 59, 39, 122, 120, 99, 118, 98, 110, 109, 44, 46, 47, 126, 33, 64, 194,
	163, 36, 37, 94, 38, 42, 40, 41, 95, 43, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 123, 125, 124, 65, 83, 68, 70, 71,
	72, 74, 75, 76, 58, 34, 90, 88, 67, 86, 66, 78, 77, 60, 62, 63, 96, 194, 161, 226, 130, 172, 35, 194, 162, 226, 136,
	158, 194, 167, 194, 182, 226, 128, 162, 194, 170, 194, 186, 226, 128, 147, 226, 137, 160, 197, 147, 226, 136, 145,
	194, 180, 194, 174, 226, 128, 160, 194, 165, 194, 168, 94, 195, 184, 207, 128, 226, 128, 156, 226, 128, 152, 194,
	171, 195, 165, 195, 159, 226, 136, 130, 198, 146, 194, 169, 203, 153, 226, 136, 134, 203, 154, 194, 172, 226, 128,
	166, 195, 166, 206, 169, 226, 137, 136, 195, 167, 226, 136, 154, 226, 136, 171, 126, 194, 181, 226, 137, 164, 226,
	137, 165, 195, 183, 197, 184, 226, 129, 132, 226, 132, 162, 226, 128, 185, 226, 128, 186, 239, 172, 129, 239, 172,
	130, 226, 128, 161, 194, 176, 194, 183, 226, 128, 154, 226, 128, 148, 194, 177, 197, 146, 226, 128, 158, 226, 128,
	176, 195, 130, 195, 138, 195, 129, 195, 139, 195, 136, 195, 152, 226, 136, 143, 226, 128, 157, 226, 128, 153, 194,
	187, 195, 133, 195, 141, 195, 142, 195, 143, 195, 140, 195, 147, 195, 148, 239, 163, 191, 195, 146, 195, 154, 195,
	134, 195, 155, 195, 153, 195, 135, 226, 151, 138, 196, 177, 203, 134, 203, 156, 194, 175, 203, 152, 194, 191, 32
];

const [byteArray1, byteArray2, byteArray3] = [
	byteArray.fromString('abcde'),
	byteArray.fromString('fghij'),
	byteArray.fromString('klmno')
];

test('ByteArray - fromString', t => {
	const bytes = byteArray.fromString(longString);
	t.deepEqual(Array.from(bytes), longArray);
});

test('ByteArray - toString', t => {
	const string = byteArray.toString(new Uint8Array(longArray));
	t.deepEqual(string, longString);
});

test('ByteArray - fromBuffer', t => {
	const bytes = byteArray.fromBuffer(byteArray.fromString('abcd').buffer);
	t.deepEqual(Array.from(bytes), [97, 98, 99, 100]);
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
