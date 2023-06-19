import * as ByteArray from '../byteArray';

export function fromBytes(byteArray: Uint8Array): string {
	return Array.from(byteArray)
		.map(byte => byte.toString(16).padStart(2, '0'))
		.join('');
}

export function toBytes(hexString: string): Uint8Array {
	const matches: RegExpMatchArray|[] = hexString.match(/.{1,2}/g) ?? [];
	const string = decodeURIComponent('%' + matches.join('%'));
	return ByteArray.fromString(string);
}

export function fromBuffer(arrayBuffer: ArrayBuffer): string {
	return Array.from(ByteArray.fromBuffer(arrayBuffer))
		.map(byte => byte.toString(16).padStart(2, '0'))
		.join('');
}
