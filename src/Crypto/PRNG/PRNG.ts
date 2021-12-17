/**Pseudo Random Number Generator*/
export function PRNG(length: number): Uint8Array {
	return crypto.getRandomValues(new Uint8Array(length));
}
