import type { HeadersInit } from '@cloudflare/workers-types';

export function getHeadersObject(headers: HeadersInit): Record<string, string> {
	if (Array.isArray(headers)) {
		return headers.reduce((acc: Record<string, string>, cur: [string, string]) => {
			const obj = acc;
			obj[cur[0]] = cur[1];
			return obj;
		}, {});
	}

	if (headers instanceof Headers) {
		const headersObj: Record<string, string> = {};
		for (const [key, value] of headers.entries()) {
			headersObj[key] = value;
		}
		return headersObj;
	}

	return headers as Record<string, string>;
}
