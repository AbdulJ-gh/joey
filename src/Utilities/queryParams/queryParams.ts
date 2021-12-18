type QueryParam = null | string | string[];
type QueryParams = Record<any, QueryParam>;

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
