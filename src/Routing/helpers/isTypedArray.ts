export function isTypedArray(obj: unknown): boolean {
	return obj instanceof Uint8Array ||
		obj instanceof Uint8Array ||
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
