import byteArray from '../byteArray';

function encode(string: string): string {
	return btoa(
		encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, (match, p1) => {
			return String.fromCharCode(Number('0x' + p1));
		})
	);
}

function decode(string: string): string {
	return decodeURIComponent(
		atob(string)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);
}

function encodeUriSafe(string: string): string {
	const map: Record<string, string> = {
		'+': '-',
		'/': '_',
		'=': ''
	};
	return encode(string).replace(/[+/=]/g, match => map[match]);
}

function decodeUriSafe(base64String: string): string {
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

function fromByteArray(array: Uint8Array, uriSafe: boolean = false): string {
	const string = byteArray.toString(array);
	return uriSafe ? encodeUriSafe(string) : encode(string);
}

function toByteArray(base64String: string, uriSafe: boolean = false): Uint8Array {
	const string = uriSafe ? decodeUriSafe(base64String) : decode(base64String);
	return Uint8Array.from(string, char => char.charCodeAt(0));
}

function fromArrayBuffer(buffer: ArrayBuffer, uriSafe: boolean = false): string {
	const string = byteArray.toString(byteArray.fromBuffer(buffer));
	return uriSafe ? encodeUriSafe(string) : encode(string);
}

function toArrayBuffer(base64String: string, uriSafe: boolean = false): ArrayBuffer {
	return toByteArray(base64String, uriSafe).buffer;
}

export default {
	encode,
	decode,
	encodeUriSafe,
	decodeUriSafe,
	fromByteArray,
	toByteArray,
	fromArrayBuffer,
	toArrayBuffer
};
