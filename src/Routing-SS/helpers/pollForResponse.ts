import type { Logger } from '../../Logger';
import { Res } from '../Res';
import { Responder } from '../Responder';
import type { WaitUntil } from '../Router';

export type Responsish = Response | null;

function respond(response: unknown, logger: Logger, waitUntil: WaitUntil) {
	if (response instanceof Response) return response;
	if (response instanceof Res) {
		if (response.get.error) {
			waitUntil(logger['exceptionHandler'](response.get.error));
		}
		return new Responder(response).respond();
	}
	return null;
}

// Badly named, it's not really polling
export function pollResponse(fn: () => unknown, logger: Logger, waitUntil: WaitUntil): Responsish {
	const response = fn();
	return respond(response, logger, waitUntil);
}

export async function asyncPollResponse(fn: () => unknown, logger: Logger, waitUntil: WaitUntil): Promise<Responsish> {
	const response = await fn();
	return respond(response, logger, waitUntil);
}
