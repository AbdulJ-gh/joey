import { JoeyConfig as Config } from '../Router';
import { Res } from '../Res';
import { Context, ResolvedHandler } from '../Router/types';
import { Responder } from '../Responder';
import { handleError } from '../Router/helpers';
import { Authorizer } from '../Authorizer';

export class Dispatcher {
	protected readonly config: Config;
	protected context: Context;
	protected authorizer: Authorizer | null;

	constructor(config: Config, context: Context, authorizer: Authorizer | null) {
		this.config = config;
		this.context = context;
		this.authorizer = authorizer;
	}

	static dispatch(event: FetchEvent, response: Response | Promise<Response>): void {
		event.respondWith(response);
	}

	public dispatch(event: FetchEvent, resolvedHandler: ResolvedHandler): void {
		event.respondWith(this.handleResponse(event, resolvedHandler));
	}

	// Handle the request
	// addEventListener cannot have an async handler, therefore this must be encapsulated in an async function and passed to event.respondWith()
	private handleResponse = async (event: FetchEvent, resolvedHandler: ResolvedHandler): Promise<Response> => {
		const { handler, authenticate } = resolvedHandler;
		try {
			// Authenticate
			if (authenticate) {
				if (!this.authorizer) {
					return Responder.error(handleError(this.config.serverError));
				} else {
					const authenticated = await this.authorizer.authenticate();
					if (authenticated instanceof Response) return authenticated;
					if (!authenticated) {
						return handleError(this.config.unauthorized);
					}
				}
			}

			// Handle the request
			const handledResponse: Res | Response | void = await handler(this.context);
			if (handledResponse === undefined) {
				return handleError(this.config.handlerDidNotReturn);
			}

			// Return response to event.respondWith
			if (handledResponse instanceof Res) {
				return handledResponse.isError
					? Responder.error(handledResponse)
					: new Responder(handledResponse).respond();
			}
			return handledResponse;
		} catch (error) {
			return handleError(this.config.serverError);
		}
	};
}
