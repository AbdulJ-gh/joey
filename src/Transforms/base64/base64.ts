import * as ByteArray from '../byteArray';

export function encode(string: string): string {
	return btoa(
		encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, (match, p1) => {
			return String.fromCharCode(Number('0x' + p1));
		})
	);
}

export function decode(string: string): string {
	return decodeURIComponent(
		atob(string)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);
}

export function encodeUriSafe(string: string): string {
	const map: Record<string, string> = {
		'+': '-',
		'/': '_',
		'=': ''
	};
	return encode(string).replace(/[+/=]/g, match => map[match]);
}

export function decodeUriSafe(base64String: string): string {
	const map: Record<string, string> = {
		'-': '+',
		_: '/'
	};
	let decoded = base64String.replace(/[-_]/g, match => map[match]);
	while (decoded.length % 4) {
		decoded += '=';
	}
	return decode(decoded);
}

export function fromByteArray(array: Uint8Array, uriSafe: boolean = false): string {
	const string = ByteArray.toString(array);
	return uriSafe ? encodeUriSafe(string) : encode(string);
}

export function toByteArray(base64String: string, uriSafe: boolean = false): Uint8Array {
	const string = uriSafe ? decodeUriSafe(base64String) : decode(base64String);
	return Uint8Array.from(string, char => char.charCodeAt(0));
}

export function fromArrayBuffer(buffer: ArrayBuffer, uriSafe: boolean = false): string {
	const string = ByteArray.toString(ByteArray.fromBuffer(buffer));
	return uriSafe ? encodeUriSafe(string) : encode(string);
}

export function toArrayBuffer(base64String: string, uriSafe: boolean = false): ArrayBuffer {
	return toByteArray(base64String, uriSafe).buffer;
}
