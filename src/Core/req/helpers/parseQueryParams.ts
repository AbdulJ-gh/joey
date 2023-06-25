import { type Param, transformParam } from '../../../Transforms/params';
import type { Req } from '../req';
import type { TransformQueryParams } from '../../types';

export function parseQueryParams(req: Req, options: TransformQueryParams): void {
	const params = req.url.searchParams;
	const { transform, listDelimiter } = options;

	const getValue = (param: string): Param | Param[] => {
		if (!transform) { return param; }
		if (listDelimiter && param.includes(listDelimiter)) {
			return param.split(listDelimiter).map(transformParam);
		}
		return transformParam(param);
	};


	params.forEach((value, key) => {
		const existingValue = req.queryParams[key];
		const transformedValue = getValue(value);

		if (existingValue === undefined) {
			req.queryParams[key] = transformedValue;
		} else {
			req.queryParams[key] = [existingValue, transformedValue].flat();
		}
	});
}
