import { BodyType, ResponseLike } from '../types';
import { Config } from '../config';
import { Res } from '../res';
import { getHeadersObject } from '../../Utilities';
import { getBodyType, setContentType, transformBody } from '../helpers';

export function generateResponse(response: ResponseLike, config: Config): Response {
	if (response instanceof Response) { return response; }
	const { body, status } = response instanceof Res ? response.get : response;
	const headers =	 getHeadersObject(response.headers || {});
	const bodyType = getBodyType(body || null);
	setContentType(bodyType, headers);
	return new Response(
		transformBody(body || null, bodyType, config.prettifyJson),
		{
			status: bodyType === BodyType.NoContent && !status ? 204 : status || 200,
			headers: { ...headers, ...config.headers }
		}
	);
}
