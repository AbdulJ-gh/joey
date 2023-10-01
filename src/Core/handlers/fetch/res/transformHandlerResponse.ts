import { Response } from '@cloudflare/workers-types';
import type { ResponseLike } from '../types';
import { Res } from './res';
import { getBodyType } from './getBodyType';
import { ConfigInstance } from '../../../config';
import { joinHeader } from './joinHeaders';
import { setContentType } from './setContentType';
import { transformBody } from './transformBody';

export function transformHandlerResponse(response: ResponseLike): Response {
	if (response instanceof Response) {
		// TODO - in docs say response won't be touched
		return response;
	}
	const options = ConfigInstance.options;
	const { status, body, headers } = response instanceof Res ? response.get : response;
	const bodyType = getBodyType(body);
	setContentType(bodyType, headers);
	const finalBody = transformBody(bodyType, body);
	const finalHeaders = headers ? joinHeader(headers, options.headers) : options.headers;
	return new Response(finalBody, { status, headers: finalHeaders });
}


/*
CONTENT							<<==			BODY WRAPPED				<<==				READ BODY TYPE

FROM RESPONSE
-------------
Require type											Converted to								Description

null															N/A													No Content
string														N/A													Plaintext
FormData													N/A													Form data
URLSearchParams										N/A													URL encoded form data
Blob															N/A													Blob
ArrayBuffer/ UintXArray						Array Buffer								Binary data as ArrayBuffer
Rest															JSON												JSON encoded string
*/
