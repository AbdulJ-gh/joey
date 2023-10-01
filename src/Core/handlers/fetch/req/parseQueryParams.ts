import type { Params, UnparsedParams } from '../../../../Utilities';
import { transformParam } from '../../../../Transforms/params';
import { getAllQueryParams } from '../../../../Utilities/queryParams';

export function parseQueryParams(url: URL, transform: boolean): Params | UnparsedParams {
	return transform
		? getAllQueryParams(url, transformParam)
		: getAllQueryParams(url);
}
