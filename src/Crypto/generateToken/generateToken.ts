import { PRNG } from '../PRNG';
import { HexString } from '../../Transforms';

export function generateToken(length: number): string {
	if (length < 8) {
		throw Error('Token must be at least 8 characters long');
	}
	const even: boolean = length % 2 === 0;
	const bytes = PRNG(even ? length / 2 : (length + 1) / 2);
	return HexString.fromBytes(bytes).slice(even ? 0 : 1);
}
