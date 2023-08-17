import { getParamsInstance, reduceMultiParam } from './helpers';
import type { Params, Transform, UnparsedParams } from './types';

/** Docs */
export function getQueryParams<ExpectedParam extends string = string>(
	url: URL | string,
	paramNames: ExpectedParam[],
): UnparsedParams<ExpectedParam>
export function getQueryParams<ExpectedParam extends string = string>(
	url: URL | string,
	paramNames: ExpectedParam[],
	transform: Transform
): Params<ExpectedParam>
export function getQueryParams<ExpectedParam extends string = string>(
	url: URL | string,
	paramNames: ExpectedParam[],
	transform?: Transform
): UnparsedParams<ExpectedParam> | Params<ExpectedParam> {
	const queryParams = getParamsInstance(url);
	const paramsObject = {} as UnparsedParams<ExpectedParam> | Params<ExpectedParam>;

	paramNames.forEach(key => {
		if (!paramsObject[key]) {
			const allParams = queryParams.getAll(key);
			transform
				? (paramsObject as Params<ExpectedParam>)[key] = reduceMultiParam(allParams.map(transform))
				: (paramsObject as UnparsedParams<ExpectedParam>)[key] = reduceMultiParam(allParams);
		}
	});

	return paramsObject;
}
