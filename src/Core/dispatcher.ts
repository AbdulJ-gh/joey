import {
	Handler,
	MiddlewareHandler,
	ResolvedHandler,
	ResponseLike,
	ResponseObject,
	ResponseBody,
	ResponseType, AsyncHandler
} from './types';
import { isTypedArray, sizeLimit } from './helpers';
import { Headers } from 'form-data';
import type Context from './context';
import { Req } from './Req';
import { Config } from './config';
import { Res } from './res';

export default class Dispatcher {
	private static getBodyType(body: ResponseBody): ResponseType {
		if (body === null) return 'noContent';
		if (typeof body === 'string') return 'plaintext';
		if (body instanceof FormData) return 'formData';
		if (body instanceof URLSearchParams) return 'urlEncodedFormData';
		if (body instanceof Blob) return 'blob';
		if (body instanceof ArrayBuffer) return 'arrayBuffer';
		if (isTypedArray(body)) return 'typedArray';
		return 'json';
	}

	// private static setContentType(responseType: ResponseType, headers?: HeadersInit) {
	// 	const headersInstance = new Headers(headers || {});
	// 	if (!headersInstance.has('content-type')) {
	// 		let contentType;
	// 		switch (responseType) {
	// 			case 'json':
	// 				contentType = 'application/json';
	// 				break;
	// 			case 'plaintext':
	// 				contentType = 'text/plain; charset=utf-8'; // This is a default if it's not set, If you want text/html for example, set it via the header
	// 				break;
	// 			case 'formData':
	// 				contentType = 'multipart/form-data';
	// 				break;
	// 			case 'urlSearchParams':
	// 				// Need an option to pick with type of form data? application/x-www-form-urlencoded is more efficient but encoded different - Todo
	// 				contentType = 'application/x-www-form-urlencoded';
	// 				break;
	// 			case 'arrayBuffer':
	// 			case 'typedArray':
	// 				contentType = 'application/octet-stream';
	// 				break;
	// 			case 'noContent':
	// 			default:
	// 				break;
	// 		}
	// 		if (contentType) {
	// 			headersInstance.set('content-type', contentType);
	// 		}
	// 	}
	// 	return headersInstance;
	// }

	public static transformBody(
		response: ResponseObject | Res,
		responseType: ResponseType,
		prettifyJson: boolean
	): BodyInit {
		// if (responseType === 'json') {
		// 	return JSON.stringify(response.body, null, prettifyJson ? 2 : 0);
		// }
		//
		// if (responseType === 'typedArray') {
		// 	return (response.body as TypedArray).buffer;
		// }
		//
		// return response.body as BodyInit;
		return ''; // Todo
	}

	public static generateResponse(response: ResponseLike, config: Config): Response {
		// if (response instanceof Response) { return response; }
		//
		// const bodyType = this.getBodyType(response.body || null);
		//
		// if (response instanceof Res) {
		// 	return new Response();
		// 	// const body = this.transformBody(response, bodyType, config.prettifyJson);
		// 	// const status = bodyType === 'noContent' && !response.status ? 204 : response.status || 200;
		// 	// const headers = this.setContentType(bodyType, response.headers);
		// 	// return new Response(body, { status, headers });
		// }
		//
		// const { body, status, headers } = response as ResponseObject;
		// return new Response(body || null, { status, headers });
		return new Response('Default response', { status: 200, headers: { 'test-header': 'abc123' } });
	}

	private static async executeHandlers(
		context: Context,
		handler: Handler,
		middleware: MiddlewareHandler[]
	): Promise<ResponseLike> {
		if (middleware.length > 0) {
			for (const ware of middleware) {
				// eslint-disable-next-line @typescript-eslint/await-thenable
				const response = await ware(context);
				if (response) return response;
			}
		}
		console.log('CONTEXT IS', context);
		return await (handler as AsyncHandler<unknown, unknown, unknown>)(context);
	}

	public static async respond(
		req: Req,
		resolvedHandler: ResolvedHandler,
		context: Context,
		globalConfig: Config
	): Promise<Response> {
		const { handler, path, config, middleware } = resolvedHandler;
		const conf: Config = { ...globalConfig, ...config };
		let response;
		const limit = sizeLimit(req.url, conf);
		if (limit) {
			response = limit;
		} else {
			Req.parsePathParams(req, path);
			conf.parseBody && (await Req.parseBody(req, conf.parseBody));
			response = await this.executeHandlers(context, handler, middleware);
		}
		return this.generateResponse(response, conf);
	}
}
