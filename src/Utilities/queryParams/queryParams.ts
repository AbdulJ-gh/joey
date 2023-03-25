import { UnparsedParam } from '../../Transforms/params';

export type QueryParam = null | UnparsedParam;
export type QueryParams<T> = Record<string, T>;

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
export function getQueryParams(url: URL|string, params: string[]): QueryParams<QueryParam> {
	const queryParams = getParamsInstance(url);
	const obj: QueryParams<QueryParam> = {};

	params.forEach(key => {
		obj[key] = returnParam(queryParams.getAll(key));
	});

	return obj;
}

export function getAllQueryParams(url: URL|string): QueryParams<UnparsedParam> {
	const queryParams = getParamsInstance(url);
	const obj: QueryParams<UnparsedParam> = {};

	queryParams.forEach((value, key) => {
		if (!obj[key]) {
			obj[key] = returnParam(queryParams.getAll(key)) as UnparsedParam;
		}
	});

	return obj;
}
