import { BodyType, type ResponseLike, type Config } from '../../types';
import { Res } from '../../res';
import { getHeadersObject } from '../../../Utilities';
import { getBodyType } from './getBodyType';
import { setContentType } from './setContentType';
import { transformBody } from './transformBody';


export function transformResponse(response: ResponseLike, config: Config): Response {
	if (response instanceof Response) { return response; }
	const { body, status } = response instanceof Res ? response.get : response;
	const headers =	 getHeadersObject(response.headers ?? {});
	const bodyType = getBodyType(body ?? null);
	setContentType(bodyType, headers);
	return new Response(
		transformBody(body ?? null, bodyType, config.prettifyJson),
		{
			status: bodyType === BodyType.NoContent && !status ? 204 : status ?? 200,
			headers: { ...headers, ...config.headers }
		}
	);
}
