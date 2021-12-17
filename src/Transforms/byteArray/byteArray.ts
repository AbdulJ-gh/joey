// UTF-8 Encoded

function fromString(string: string): Uint8Array {
	return new TextEncoder().encode(string);
}

function toString(byteArray: Uint8Array): string {
	return new TextDecoder().decode(byteArray);
}

function fromBuffer(arrayBuffer: ArrayBuffer): Uint8Array {
	return new Uint8Array(arrayBuffer);
}

function toBuffer(byteArray: Uint8Array): ArrayBuffer {
	return byteArray.buffer;
}

function join(byteArray: Uint8Array, ...items: Uint8Array[]): Uint8Array {
	return Uint8Array.from(Array.from(byteArray).concat(...items.map(item => Array.from(item))));
}

export { fromString, toString, fromBuffer, toBuffer, join };
