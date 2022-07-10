export declare type QueryParam = null | string | string[];
export declare type QueryParams = Record<string, QueryParam>;

function returnParam(param: string[]): QueryParam {
	switch (param.length) {
		case 0:
			return null;
		case 1:
			return param[0];
		default:
			return param;
	}
}

function getParamsInstance(url: URL|string) {
	return url instanceof URL ? url.searchParams : new URL(url).searchParams;
}

export function getQueryParam(url: URL|string, param: string): QueryParam {
	const queryParams = getParamsInstance(url);
	return returnParam(queryParams.getAll(param));
}

// For specifying a list of expected query params
export function getQueryParams(url: URL|string, params: string[]): QueryParams {
	const queryParams = getParamsInstance(url);
	const obj: QueryParams = {};

	params.forEach(key => {
		obj[key] = returnParam(queryParams.getAll(key));
	});

	return obj;
}


export function transformParam(param: string): null | boolean | number | string | void {
	// 9007199254740991 >= int >= -9007199254740991
	function parseSafeInt(param: string): number | void {
		if (param.length <= 17) {
			const paramStringArray = param.split('');
			const numChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
			const isNumChar = (char: string): boolean => numChars.includes(char);
			const isOk = (char: string, index: number): boolean =>
				isNumChar(char) || (index === 0 && (char === '-' || char === '+'));

			if (paramStringArray.every(isOk)) {
				const int = Number.parseInt(param, 10);
				if (int >= Number.MIN_SAFE_INTEGER && int <= Number.MAX_SAFE_INTEGER) {
					return int;
				}
			}
		}
	}
	function parseIntElseDecodeUri(param: string): number | string {
		// `0` is falsey so handled in switch statement below
		return parseSafeInt(param) || decodeURIComponent(param);
	}

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

export function getAllQueryParams(url: URL|string): QueryParams {
	const queryParams = getParamsInstance(url);
	const obj: QueryParams = {};

	queryParams.forEach((value, key) => {
		if (!obj[key]) {
			obj[key] = returnParam(queryParams.getAll(key));
		}
	});

	return obj;
}
