import { AuthData, AuthHandler, Context } from '../Router/types';
import { Res } from '../Res';
import { Responder } from '../Responder';

export class Authorizer {
	private readonly authHandler: AuthHandler = () => null;
	private readonly context: Context;
	private authData: AuthData = null;

	constructor(authHandler: AuthHandler, context: Context) {
		this.authHandler = authHandler;
		this.context = context;
	}

	public async authenticate(): Promise<Response | boolean> {
		const authResponse = await this.authHandler(this.context);
		if (authResponse instanceof Res) return new Responder(authResponse).respond();
		if (authResponse instanceof Response) return authResponse;
		this.authData = authResponse;
		if (this.authData) this.context.req.authData = this.authData;
		return this.authData !== false; // If authData === null, this returns true and allows the request to proceed unauthenticated, as wanted
	}
}
