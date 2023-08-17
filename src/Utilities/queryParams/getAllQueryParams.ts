import { getParamsInstance, reduceMultiParam } from './helpers';
import type { Params, Transform, UnparsedParams } from './types';

/** Docs */
export function getAllQueryParams<ExpectedParam extends string = string>(
	url: URL | string,
): UnparsedParams<ExpectedParam>
export function getAllQueryParams<ExpectedParam extends string = string>(
	url: URL | string,
	transform: Transform
): Params<ExpectedParam>
export function getAllQueryParams<ExpectedParam extends string = string>(
	url: URL | string,
	transform?: Transform
): UnparsedParams<ExpectedParam> | Params<ExpectedParam> {
	const queryParams = getParamsInstance(url);
	const paramsObject = {} as UnparsedParams<ExpectedParam> | Params<ExpectedParam>;

	queryParams.forEach((value, key) => {
		if (!paramsObject[key as ExpectedParam]) {
			const allParams = queryParams.getAll(key);
			if (transform) {
				(paramsObject as Params<ExpectedParam>)[key as ExpectedParam] =
					reduceMultiParam(allParams.map(transform));
			} else {
				(paramsObject as UnparsedParams<ExpectedParam>)[key as ExpectedParam] =
					reduceMultiParam(allParams);
			}
		}
	});

	return paramsObject;
}
