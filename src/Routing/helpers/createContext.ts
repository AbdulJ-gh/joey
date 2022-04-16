import { Req } from '../Req';
import { Res } from '../Res';
import type { Config } from '../config';
import type { Context } from '../Router';
import { sizeLimit } from './sizeLimit';

export function createContext(event: FetchEvent, req: Req, config: Required<Config>, absolutePath?: string): Context {
	const { headers, prettifyJson } = config;
	const res = new Res().set({ headers, pretty: prettifyJson });

	/** Limits */
	const limit = sizeLimit(req.URL, config);
	if (limit) event.respondWith(limit);

	config.extractPathParams && Req.getPathParams(req, absolutePath as string);
	config.extractQueryParams && Req.getQueryParams(req);

	return { req, res, waitUntil: (promise: Promise<unknown>) => event.waitUntil(promise) };
}
