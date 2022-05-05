import { Config } from '../config';
import { Responder } from '../Responder';
import { handleDefaultError } from './handleError';
import { Responsish } from './pollForResponse';

export function sizeLimit(url: URL, config: Required<Config>): Responsish {
	if (url.href.length > config.maxUrlLength) {
		return new Responder(handleDefaultError(config.urlTooLong, config.prettifyJson)).respond();
	}
	if (url.search.length > config.maxQueryLength) {
		return new Responder(handleDefaultError(config.queryTooLong, config.prettifyJson)).respond();
	}
	return null;
}
