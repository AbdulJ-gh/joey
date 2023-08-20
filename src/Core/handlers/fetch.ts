import { ExportedHandlerFetchHandler, Response } from '@cloudflare/workers-types';

export const fetch: ExportedHandlerFetchHandler = async (
	request,
	env,
	ctx
): Promise<Response> => {
	console.log(request, env, ctx);
	return new Response('Hello world');
};
