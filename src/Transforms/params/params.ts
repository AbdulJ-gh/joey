import type { Param } from '../../Utilities';

/**
 * `true` <- 'true' case-insensitively.
 *
 *
 * `false` <- 'false' case-insensitively.
 *
 *
 * `null` <- 'null' case-insensitively
 *
 *
 * int <- 9007199254740991 >= int >= -9007199254740991, including -/+ sign.
 *
 *
 * floats ->Not supported<-
 *
 *
 * string <- Everything else URI component decoded
 */
export function transformParam(param: string): Param {
	const lcp = param.toLowerCase();
	if (lcp === 'true') { return true; }
	if (lcp === 'false') { return false; }
	if (lcp === 'null') { return null; }
	return parseSafeInt(param) ?? decodeURIComponent(param);
}

export function parseSafeInt(param: string): number | null {
	if (param.length <= 17) {
		const paramStringArray = param.split('');
		const numChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		const isOk = (char: string, index: number): boolean => {
			return numChars.includes(char) ||
				(index === 0 && (char === '-' || char === '+'));
		};
		if (paramStringArray.every(isOk)) {
			const int = Number.parseInt(param, 10);
			if (int >= Number.MIN_SAFE_INTEGER && int <= Number.MAX_SAFE_INTEGER) {
				return int;
			}
		}
	}
	return null;
}
