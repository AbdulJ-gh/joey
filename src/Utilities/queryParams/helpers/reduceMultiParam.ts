export function reduceMultiParam<T>(param: T[]): null | T | T[] {
	if (param.length === 0) { return null; }
	if (param.length === 1) { return param[0]; }
	return param;
}
