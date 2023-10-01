import { BodyType, type ResponseLike, type Config } from '../../types';
import { Res, type ResponseBody } from '../../res';
import { Headers } from '../../../src/Utilities';
import { getBodyType } from './getBodyType';
import { setContentType } from './setContentType';
import { transformBody } from './transformBody';


export function transformResponse(response: ResponseLike, config: Config): Response {
	if (response instanceof Response) { return response; }
	const { body, status } = response instanceof Res ? response.get : response;
	const headers =	 Headers.getHeadersObject(response.headers ?? {});
	const bodyType = getBodyType(body as ResponseBody ?? null);
	setContentType(bodyType, headers);

	return new Response(
		transformBody(body as ResponseBody ?? null, bodyType, config.prettifyJson),
		{
			status: bodyType === BodyType.NoContent && !status ? 204 : status ?? 200,
			headers: { ...headers, ...config.headers }
		}
	);
}
