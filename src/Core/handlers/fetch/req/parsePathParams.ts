import type { Req } from './req';
import { transformParam } from '../../../../Transforms/params';
import { ConfigInstance } from '../../../config';

export function parsePathParams(req: Req, route: string): void {
	// @ts-ignore
	req['route'] = route;
	const path = req.url.pathname;
	const { transformPathParams } = ConfigInstance.options;

	if (route.includes('/:')) {
		const pathSplit = path.split('/');
		const routeSplit = route.split('/');

		for (let i = 0; i < pathSplit.length; i++) {
			if (routeSplit[i].startsWith(':')) {
				req.pathParams[routeSplit[i].slice(1)] = transformPathParams
					? transformParam(pathSplit[i])
					: pathSplit[i];
			}
		}
	}
}
