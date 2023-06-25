import { transformParam, type Param } from '../../../Transforms/params';
import type { Req } from '../req';

export function parsePathParams(req: Req, parameterisedPath: string, transform: boolean): void {
	const getValue = (param: string): Param => transform ? transformParam(param) : param;

	req.route = parameterisedPath;
	const path = req.url.pathname;


	if (parameterisedPath?.includes('/:')) {
		const pathSplit = path.split('/');
		const paramPathSplit = parameterisedPath.split('/');

		for (let i = 0; i < pathSplit.length; i++) {
			if (paramPathSplit[i].startsWith(':')) {
				const param = paramPathSplit[i].slice(1);
				const existingValue = req.pathParams[param];
				const transformedValue = getValue(pathSplit[i]);

				if (existingValue === undefined) {
					req.pathParams[param] = transformedValue;
				} else {
					req.pathParams[param] = [existingValue, transformedValue].flat();
				}
			}
		}
	}
}
