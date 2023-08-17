import { getParamsInstance, reduceMultiParam } from './helpers';
import type { UnparsedQueryParam, QueryParam, Transform } from './types';

/** Docs */
export function getQueryParam(url: URL | string, paramName: string): UnparsedQueryParam;
export function getQueryParam(url: URL | string, paramName: string, transform: Transform): QueryParam;
export function getQueryParam(
	url: URL | string,
	paramName: string,
	transform?: Transform
): UnparsedQueryParam | QueryParam {
	const allParams = getParamsInstance(url).getAll(paramName);
	return reduceMultiParam(transform ? allParams.map(transform) : allParams);
}
