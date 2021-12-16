import { isEqual } from 'lodash';

type IntArrayLike = Array<number> | ArrayBuffer;

/** This works with all types **/
// Converts plain arrays to typed array and back to array
// Converts ArrayBuffers to typed array and then to array
// Create a TypedArray from a typed array and then converts to plain array

export default function bytesAreEqual(a: IntArrayLike, b: IntArrayLike): boolean {
	return isEqual(Array.from(new Uint8Array(a)), Array.from(new Uint8Array(b)));
}
