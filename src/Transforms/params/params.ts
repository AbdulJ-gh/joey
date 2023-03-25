// TODO - use (before validation but have option to turn off)
// TODO - Add on off option

export type UnparsedParam = string | string[];
export type Param = null | boolean | number | string | void;
export type ParamsRecord = Record<string, Param | Param[]>;

export function transformParamsObject(paramsObject: Record<string, UnparsedParam>): ParamsRecord {
	const params: ParamsRecord = {};

	for (const param in paramsObject) {
		if (typeof paramsObject[param] === 'string') {
			params[param] = transformParam(paramsObject[param] as string);
		} else {
			params[param] = (paramsObject[param] as string[]).map(transformParam);
		}
	}

	return params;
}


/**
 * Only parses integers between 9007199254740991 >= int >= -9007199254740991
 * Does not parse floats
 */
export function transformParam(param: string): Param {
	switch (param.toLowerCase()) {
		case 'true':
			return true;
		case 'false':
			return false;
		case 'null':
			return null;
		case '0':
			return 0;
		default:
			return parseIntElseDecodeUri(param);
	}
}

function parseIntElseDecodeUri(param: string): number | string {
	// `0` is falsey so handled in switch statement below
	return parseSafeInt(param) || decodeURIComponent(param);
}

function parseSafeInt(param: string): number | void {
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
