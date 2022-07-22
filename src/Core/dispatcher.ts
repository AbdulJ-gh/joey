import type { AsyncHandler, Handler, MiddlewareHandler, ResolvedHandler, ResponseLike } from './types';
import { Res, type ResponseBody } from './res';
import { isTypedArray, sizeLimit, type TypedArray } from './helpers';
import type Context from './context';
import { Req } from './req';
import type { Config } from './config';
import { getHeadersObject, getHeadersInstance } from '../Utilities';

type BodyType =
	| 'noContent'
	| 'plaintext'
	| 'json'
	| 'arrayBuffer'
	| 'typedArray'
	| 'blob'
	| 'urlEncodedFormData'
	| 'formData'

export default class Dispatcher {
	private static getBodyType(body: ResponseBody): BodyType {
		if (body === null) return 'noContent';
		if (typeof body === 'string') return 'plaintext';
		if (body instanceof FormData) return 'formData';
		if (body instanceof URLSearchParams) return 'urlEncodedFormData';
		if (body instanceof Blob) return 'blob';
		if (body instanceof ArrayBuffer) return 'arrayBuffer';
		if (isTypedArray(body)) return 'typedArray';
		return 'json';
	}

	private static setContentType(bodyType: BodyType, headers: Headers|Record<string, string>): void {
		// Cannot set content type for Response type because body is already transformed
		// For any response, manually setting the content type header will override these defaults. For example `text/html` for plaintext content.
		// Essentially the default content types will match the data correctly, but might not be specific enough for your needs.
		let contentType;

		if (!getHeadersInstance(headers || {}).has('content-type')) {
			switch (bodyType) {
				case 'json':
					contentType = 'application/json';
					break;
				case 'plaintext':
					contentType = 'text/plain; charset=utf-8';
					break;
				case 'formData':
					contentType = 'multipart/form-data';
					break;
				case 'urlEncodedFormData':
					contentType = 'application/x-www-form-urlencoded';
					break;
				case 'arrayBuffer':
				case 'typedArray':
					contentType = 'application/octet-stream';
					break;
				case 'noContent':
				default:
					break;
			}
		}
		if (contentType) {
			headers instanceof Headers
				? headers.set('content-type', contentType)
				: headers['content-type'] = contentType;
		}
	}

	public static transformBody(
		body: ResponseBody,
		bodyType: BodyType,
		prettifyJson: boolean
	): BodyInit {
		if (bodyType === 'json') {
			return JSON.stringify(body, null, prettifyJson ? 2 : 0);
		}
		if (bodyType === 'typedArray') { return (body as TypedArray).buffer; }
		return body as BodyInit;
	}

	public static generateResponse(response: ResponseLike, config: Config): Response {
		if (response instanceof Response) { return response; }
		const { body, status } = response instanceof Res ? response.get : response;
		const headers =	 getHeadersObject(response.headers || {});
		const bodyType = this.getBodyType(body || null);
		this.setContentType(bodyType, headers);
		return new Response(
			this.transformBody(body || null, bodyType, config.prettifyJson),
			{
				status: bodyType === 'noContent' && !status ? 204 : status || 200,
				headers: { ...headers, ...config.headers }
			}
		);
	}

	private static async executeHandlers(
		context: Context,
		handler: Handler,
		middleware: MiddlewareHandler[]
	): Promise<ResponseLike> {
		if (middleware.length > 0) {
			for (const ware of middleware) {
				const response = await ware(context);
				if (response) return response;
			}
		}
		return await (<AsyncHandler>handler)(context);
	}

	public static async respond(
		req: Req,
		resolvedHandler: ResolvedHandler,
		context: Context,
		config: Config,
		middleware: MiddlewareHandler[]
	): Promise<Response> {
		const { handler, path, config: handlerConfig, middleware: handlerMiddleware } = resolvedHandler;

		const combinedHeaders = handlerConfig?.headers
			? { ...config.headers, ...handlerConfig.headers }
			: config.headers;

		const combinedConfig = !handlerConfig
			? config
			: {
				...config,
				...handlerConfig,
				headers: combinedHeaders
			};

		const combinedMiddleware = handlerMiddleware ? [...middleware, ...handlerMiddleware] : middleware;

		let handlerResponse = sizeLimit(req.url, combinedConfig);
		if (!handlerResponse) {
			Req.parsePathParams(req, path);
			combinedConfig.parseBody && (await Req.parseBody(req, combinedConfig.parseBody));
			handlerResponse = await this.executeHandlers(context, handler, combinedMiddleware);
		}

		return this.generateResponse(handlerResponse, combinedConfig);
	}
}
