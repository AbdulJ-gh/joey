import { prng } from '../prng';
import { HexString } from '../../Transforms';

export function generateToken(length: number): string {
	if (length < 8) {
		throw Error('Token must be at least 8 characters long');
	}
	const even = length % 2 === 0;
	const bytes = prng(even ? length / 2 : (length + 1) / 2);
	return HexString.fromBytes(bytes).slice(even ? 0 : 1);
}
