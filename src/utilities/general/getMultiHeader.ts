export default function getMultiHeader(headerValue: string): Record<string, string> {
	const split = headerValue.split(', ');
	const values: Record<string, any> = {};

	for (let i = 0; i < split.length; i++) {
		const [key, value] = split[i].split(' ');
		values[key] = value;
	}

	return values;
}
