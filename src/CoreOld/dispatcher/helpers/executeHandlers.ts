import type Context from '../../context';
import type { RegisteredHandler, ResponseLike, AsyncHandler } from '../../types';

/** ---- Execution ----
 * Execute middleware
 * Execute handler
 */
export async function executeHandlers(
	context: Context,
	registeredHandler: RegisteredHandler
): Promise<ResponseLike> {
	const { handler, middleware } = registeredHandler;

	if (middleware.length > 0) {
		for (const ware of middleware) {
			const response = await ware(context);
			if (response) return response;
		}
	}

	return await (<AsyncHandler>handler)(context);
}
