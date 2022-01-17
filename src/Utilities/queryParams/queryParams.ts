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

export function getQueryParam(url: URL, param: string): QueryParam {
	const queryParams = new URLSearchParams(url.search);
	return returnParam(queryParams.getAll(param));
}
export function getQueryParams(url: URL, params: string[]): QueryParams {
	const queryParams = new URLSearchParams(url.search);
	const obj: QueryParams = {};

	params.forEach(key => {
		obj[key] = returnParam(queryParams.getAll(key));
	});

	return obj;
}

export function getAllQueryParams(url: URL): QueryParams {
	const queryParams = new URLSearchParams(url.search);
	const obj: QueryParams = {};

	queryParams.forEach((value, key) => {
		if (!obj[key]) {
			obj[key] = returnParam(queryParams.getAll(key));
		}
	});

	return obj;
}
