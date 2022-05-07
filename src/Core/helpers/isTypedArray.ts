// https://datatracker.ietf.org/doc/html/rfc2046#section-4.5.1

export type TypedArray =
	| Uint8Array
	| Int8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array
	| BigInt64Array
	| BigUint64Array;

export function isTypedArray(obj: unknown): boolean {
	return obj instanceof Uint8Array ||
		obj instanceof Int8Array ||
		obj instanceof Uint8ClampedArray ||
		obj instanceof Int16Array ||
		obj instanceof Uint16Array ||
		obj instanceof Int32Array ||
		obj instanceof Uint32Array ||
		obj instanceof Float32Array ||
		obj instanceof Float64Array ||
		obj instanceof BigInt64Array ||
		obj instanceof BigUint64Array;
}
