export function getHeadersInstance(headers: HeadersInit): Headers {
	if (headers instanceof Headers) return headers;
	return new Headers(headers);
}
