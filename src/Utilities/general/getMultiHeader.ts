export function getMultiHeader(headerValue: string): Record<string, string> {
	const headers = headerValue.split(', ');
	const values: Record<string, string> = {};

	for (const header of headers) {
		const [key, value] = header.split(' ');
		values[key] = value;
	}

	return values;
}
