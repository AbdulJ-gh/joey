export function reduceMultiParam<T>(param: T[]): null | T | T[] {
	switch (param.length) {
		case 0:
			return null;
		case 1:
			return param[0];
		default:
			return param;
	}
}
