import { AuthData } from '../Authenticator';
import type { PathParams } from './types';

export class Req extends Request {
	public auth: AuthData = null;
	public pathParams: PathParams = {};
	[key: string]: unknown

	constructor(request: Request) {
		super(request);
	}

	private static pathHasParams(parameterizedPath: string): boolean {
		return parameterizedPath.includes('/:');
	}

	public static getPathParams(req: Req, parameterizedPath: string): void {
		const path = new URL(req.url).pathname;

		if (this.pathHasParams(parameterizedPath)) {
			const params: Record<string, string> = {};
			const pathSplit = path.split('/');
			const paramPathSplit = parameterizedPath.split('/');

			for (let i = 0; i < pathSplit.length; i++) {
				if (paramPathSplit[i].startsWith(':')) {
					params[paramPathSplit[i].slice(1)] = pathSplit[i];
				}
			}

			req.pathParams = params;
		}
	}
}
