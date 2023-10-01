import { transformParam } from '../../../src/Transforms/params';
import type { Req } from '../req';

export function parsePathParams(req: Req, parameterisedPath: string, transform: boolean): void {
	req.route = parameterisedPath;
	const path = req.url.pathname;

	if (parameterisedPath?.includes('/:')) {
		const pathSplit = path.split('/');
		const paramPathSplit = parameterisedPath.split('/');

		for (let i = 0; i < pathSplit.length; i++) {
			if (paramPathSplit[i].startsWith(':')) {
				req.pathParams[paramPathSplit[i].slice(1)] = transform
					? transformParam(pathSplit[i])
					: pathSplit[i];
			}
		}
	}
}
