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
export function getQueryParams(url: URL|string, params: string[]): QueryParams {
	const queryParams = getParamsInstance(url);
	const obj: QueryParams = {};

	params.forEach(key => {
		obj[key] = returnParam(queryParams.getAll(key));
	});

	return obj;
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
