import { Res } from '../Res';
import type { Context } from '../Router';
import type { Logger } from '../../Logger';
import type { AuthHandler } from './types';

export class Authenticator {
	public authHandler: AuthHandler;

	constructor(authHandler: AuthHandler) {
		this.authHandler = authHandler;
	}

	public async authenticate(context: Context, logger: Logger): Promise<Res | Response | void> {
		const authResponse = await this.authHandler(context, logger);

		if (authResponse instanceof Res || authResponse instanceof Response) {
			return authResponse;
		}

		context.req.auth = authResponse;
	}
}
