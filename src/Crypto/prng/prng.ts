/**Pseudo Random Number Generator*/
export function prng(length: number): Uint8Array {
	return crypto.getRandomValues(new Uint8Array(length));
}
