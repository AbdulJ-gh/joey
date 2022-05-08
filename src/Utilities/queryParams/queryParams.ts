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

const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
export function transformParam(param: string): string | boolean | number {
	if (param.length <= 16) {
		const split = param.split('');

		const dots = split.filter(num => num === '.');

		if (dots.length < 2 && split.every(val => nums.includes(val))) {
			return param.includes('.')
				? Number.parseFloat(param)
				: Number.parseInt(param, 10);
		}
	}

	switch (param) {
		case 'true':
		case 'TRUE':
			return true;
		case 'false':
		case 'FALSE':
			return false;
		default:
			return param;
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
