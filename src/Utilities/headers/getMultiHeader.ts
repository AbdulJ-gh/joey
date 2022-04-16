export function getMultiHeader(headerValue: string, separator = ', '): Record<string, string> {
	const headers = headerValue.split(separator);
	const values: Record<string, string> = {};

	for (const header of headers) {
		const [key, value] = header.split(' ');
		values[key] = value;
	}

	return values;
}
