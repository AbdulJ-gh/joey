import { Req } from '../Req';
import { Res } from '../Res';
import type { Config } from '../config';
import type { Context } from '../Router';

export function createContext(ctx: ExecutionContext, req: Req, config: Required<Config>, absolutePath?: string): Context {
	const { headers, prettifyJson } = config;
	const res = new Res().set({ headers, pretty: prettifyJson });

	config.extractPathParams && Req.getPathParams(req, absolutePath as string);
	config.extractQueryParams && Req.getQueryParams(req);

	return { req, res, waitUntil: (promise: Promise<unknown>) => ctx.waitUntil(promise) };
}
