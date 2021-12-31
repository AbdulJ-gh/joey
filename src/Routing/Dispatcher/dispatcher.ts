import { Res } from '../Res';
import { Responder } from '../Responder';
import { Router } from '../Router';
import { handleError } from '../Router/helpers';
import type { Config } from '../config';
import type { Context, ResolvedHandler } from '../Router';

// Object.assign https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
// "If the source value is a reference to an object, it only copies the reference value."
// Register and Authorizer are copied by reference. Config is copied by value.


export class Dispatcher extends Router {
	constructor(routerContext: Router) {
		super();
		Object.assign(this, routerContext);
	}

	public dispatch(event: FetchEvent, resolvedHandler: ResolvedHandler, context: Context): void {
		event.respondWith(this.handleResponse(resolvedHandler, context));
	}

	// addEventListener cannot have an async handler, therefore this must be encapsulated in an async function and passed to event.respondWith()
	public handleResponse = async (resolvedHandler: ResolvedHandler, context: Context): Promise<Response> => {
		const { handler, authenticate } = resolvedHandler;
		try {
			// Authenticate
			if (authenticate) {
				if (this.authenticator !== null) {
					const authenticated = await this.authenticator.authenticate(context);
					if (authenticated instanceof Response) return authenticated;
					if (!authenticated) { return handleError((this.config as Config).unauthorized); }
				}
			}

			// Handle the request
			const handledResponse: Res | Response | void = await handler(context);
			if (handledResponse === undefined) {
				return handleError((this.config as Config).handlerDidNotReturn);
			}

			// Return response for `event.respondWith`
			if (handledResponse instanceof Res) {
				return handledResponse.isError
					? Responder.error(handledResponse)
					: new Responder(handledResponse).respond();
			}
			return handledResponse;
		} catch (error) {
			return handleError((this.config as Config).serverError);
		}
	};
}
