import { Res } from '../Res';
import type { Context } from '../Router';
import type { AuthHandler } from './types';

export class Authenticator {
	public authHandler: AuthHandler;

	constructor(authHandler: AuthHandler) {
		this.authHandler = authHandler;
	}

	public async authenticate(context: Context): Promise<Res | Response | boolean> {
		const authResponse = await this.authHandler(context);

		if (authResponse instanceof Res || authResponse instanceof Response || typeof authResponse === 'boolean') {
			return authResponse;
		}

		context.req.auth = authResponse;
		return true;
	}
}
