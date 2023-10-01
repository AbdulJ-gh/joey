// import { parseFormData } from '../../../Utilities/formData';
import type { Req } from '../req';
import type { Config, BodyType } from '../../types';

export async function parseBody(req: Req, config: Config): Promise<void> {
	const { parseBody, contentHeaderParseMap } = config;

	if (parseBody === false) {
		return;
	}

	try {
		let headerMatch: BodyType | undefined;

		if (parseBody === 'content-type-header') {
			const contentHeader = req.headers['content-type'].toLowerCase();
			const matcher = contentHeaderParseMap.matchers.find(matcher => {
				const query = matcher.query.toLowerCase();
				return matcher.matcher === 'exclusive' ? query === contentHeader : contentHeader.includes(query);
			});
			headerMatch = matcher?.bodyType ?? null;
		}
		// if (req.method !== 'GET' || req.method !== 'HEAD') {
		if (req.method !== 'GET') {
			switch (headerMatch ?? parseBody) {
				case 'plaintext':
					req.body = await req.text();
					break;
				case 'json':
					req.body = await req.json();
					break;
				case 'formData':
					req.body = await req.formData();
					// req.body = parseFormData(await req.formData());
					break;
				case 'blob':
					req.body = await req.blob();
					break;
				case 'buffer':
					req.body = await req.arrayBuffer();
					break;
				case null:
				default:
					req.body = null;
					break;
			}
		}
	} catch {
		req.body = null;
	}
}
