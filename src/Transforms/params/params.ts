export type UnparsedParam = string | string[];
export type Param = null | boolean | number | string;
export type ParamsRecord = Record<string, Param | Param[]>;

/**
 * Only parses integers between 9007199254740991 >= int >= -9007199254740991, including -/+ sign
 * Does not parse floats
 */
export function transformParam(param: string): Param {
	function parseIntElseDecodeUri(param: string): number | string {
		return parseSafeInt(param) ?? decodeURIComponent(param);
	}

	switch (param.toLowerCase()) {
		case 'true':
			return true;
		case 'false':
			return false;
		case 'null':
			return null;
		default:
			return parseIntElseDecodeUri(param);
	}
}


function parseSafeInt(param: string): number | undefined {
	if (param.length <= 17) {
		const paramStringArray = param.split('');
		const numChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		const isOk = (char: string, index: number): boolean =>
			numChars.includes(char) || (index === 0 && (char === '-' || char === '+'));

		if (paramStringArray.every(isOk)) {
			const int = Number.parseInt(param, 10);
			if (int >= Number.MIN_SAFE_INTEGER && int <= Number.MAX_SAFE_INTEGER) {
				return int;
			}
		}
	}
}
