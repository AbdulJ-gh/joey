import type { Config, ResponseLike } from '../../types';

export function sizeLimit(url: URL, config: Config): ResponseLike | void {
	if (url.href.length > config.maxUrlLength) {
		return config.exceededUrlLimit;
	}
	if (url.search.length > config.maxQueryLength) {
		return config.exceededQueryLimit;
	}
}
