import { Config } from '../config';
import { ResponseLike } from '../types';

export function sizeLimit(url: URL, config: Config): ResponseLike | void {
	if (url.href.length > config.maxUrlLength) {
		return config.urlTooLong;
	}
	if (url.search.length > config.maxQueryLength) {
		return config.queryTooLong;
	}
}
