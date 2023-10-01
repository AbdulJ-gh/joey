import type { HeadersInit } from '@cloudflare/workers-types';

export function joinHeader(headers: HeadersInit, baseHeaders: Record<string, string>): HeadersInit {
	for (const entry in Object.entries(baseHeaders)) {
		const [key, value] = entry;
		if (headers instanceof Headers && !headers.has(key)) {
			headers.set(key, value);
		} else if (!Array.isArray(headers) && !(<Record<string, string>>headers)[key]) {
			(<Record<string, string>>headers)[key] = value;
		} else {
			const index = (<string[][]>headers).findIndex(pair => pair[0] === key);
			if (index === -1) {
				(<string[][]>headers).push([key, value]);
			}
		}
	}

	return headers;
}
