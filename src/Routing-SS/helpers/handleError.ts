import { Res } from '../Res';
import { Config, DefaultError } from '../config';
import type { Logger } from '../../Logger';
import { Responder } from '../Responder';
import { WaitUntil } from '../Router';

// Mainly used for client errors
export function handleDefaultError(response: DefaultError, prettify: boolean): Res {
	if (typeof response === 'number') {
		return new Res(null, response);
	}
	return new Res(response.body, response.status, response.headers || {}, prettify);
}


export function handleSystemError(
	waitUntil: WaitUntil,
	config: Required<Config>,
	logger: Logger,
	error: unknown
): Response {
	waitUntil(logger['exceptionHandler'](error));
	const res = handleDefaultError(config.internalServerError, config.prettifyJson);
	return new Responder(res).respond();
}
