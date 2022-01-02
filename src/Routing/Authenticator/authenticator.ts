import { Res } from '../Res';
import { Responder } from '../Responder';
import type { Context } from '../Router';
import type { AuthData, AuthHandler } from './types';

export class Authenticator {
	public authHandler: AuthHandler = () => null;
	public authData: AuthData = null;
	public hasOwnHandler = false;

	public setHandler(authHandler: AuthHandler) {
		this.authHandler = authHandler;
		this.hasOwnHandler = true;
	}

	public async authenticate(context: Context): Promise<Response | boolean> {
		const authResponse = await this.authHandler(context);
		if (authResponse instanceof Res) return new Responder(authResponse).respond();
		if (authResponse instanceof Response) return authResponse;
		this.authData = authResponse;
		if (this.authData) context.req.authData = this.authData;
		return this.authData !== false; // If authData === null, this returns true and allows the request to proceed unauthenticated
	}
}