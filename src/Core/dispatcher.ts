import type { AsyncHandler, Handler, MiddlewareHandler, ResolvedHandler, ResponseLike, Validator } from './types';
import { Res, type ResponseBody } from './res';
import { isTypedArray, sizeLimit, type TypedArray } from './helpers';
import type Context from './context';
import { Req } from './req';
import type { Config } from './config';
import { getHeadersObject, getHeadersInstance } from '../Utilities';

enum BodyType {
	NoContent = 'noContent',
	Plaintext =	'plaintext',
  JSON = 'json',
	ArrayBuffer = 'arrayBuffer',
	TypedArray = 'typedArray',
	Blob = 'blob',
	UrlEncodedFormData = 'urlEncodedFormData',
	FormData = 'formData'
}

export default class Dispatcher {
	private static getBodyType(body: ResponseBody): BodyType {
		if (body === null) return BodyType.NoContent;
		if (typeof body === 'string') return BodyType.Plaintext;
		if (body instanceof FormData) return BodyType.FormData;
		if (body instanceof URLSearchParams) return BodyType.UrlEncodedFormData;
		if (body instanceof Blob) return BodyType.Blob;
		if (body instanceof ArrayBuffer) return BodyType.ArrayBuffer;
		if (isTypedArray(body)) return BodyType.TypedArray;
		return BodyType.JSON;
	}

	private static setContentType(bodyType: BodyType, headers: Headers|Record<string, string>): void {
		// Cannot set content type for Response type because body is already transformed
		// For any response, manually setting the content type header will override these defaults. For example `text/html` for plaintext content.
		// Essentially the default content types will match the data correctly, but might not be specific enough for your needs.
		let contentType;
		if (!getHeadersInstance(headers || {}).has('content-type')) {
			switch (bodyType) {
				case BodyType.JSON:
					contentType = 'application/json';
					break;
				case BodyType.Plaintext:
					contentType = 'text/plain; charset=utf-8';
					break;
				case BodyType.FormData:
					contentType = 'multipart/form-data';
					break;
				case BodyType.UrlEncodedFormData:
					contentType = 'application/x-www-form-urlencoded';
					break;
				case BodyType.ArrayBuffer:
				case BodyType.TypedArray:
					contentType = 'application/octet-stream';
					break;
				case BodyType.NoContent:
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

	private static transformBody(body: ResponseBody, bodyType: BodyType, prettifyJson: boolean): BodyInit {
		if (bodyType === BodyType.JSON) {
			return JSON.stringify(body, null, prettifyJson ? 2 : 0);
		}
		if (bodyType === BodyType.TypedArray) { return (body as TypedArray).buffer; }
		return body as BodyInit;
	}

	private static generateResponse(response: ResponseLike, config: Config, bodyType: BodyType): Response {
		if (response instanceof Response) { return response; }
		const { body, status } = response instanceof Res ? response.get : response;
		const headers =	 getHeadersObject(response.headers || {});
		this.setContentType(bodyType, headers);
		return new Response(
			this.transformBody(body || null, bodyType, config.prettifyJson),
			{
				status: bodyType === BodyType.NoContent && !status ? 204 : status || 200,
				headers: { ...headers, ...config.headers }
			}
		);
	}

	private static async executeHandlers(
		context: Context,
		handler: Handler,
		middleware: MiddlewareHandler[],
		bodyType: BodyType,
		config: Config,
		validator?: Validator
	): Promise<ResponseLike> {
		const sizeLimitResponse = sizeLimit(context.req.url, config);
		if (sizeLimitResponse) return sizeLimitResponse;

		if (validator) {
			const response = this.validateHandler(validator, context, bodyType, config);
			if (response) return response;
		}

		if (middleware.length > 0) {
			for (const ware of middleware) {
				const response = await ware(context);
				if (response) return response;
			}
		}
		return await (<AsyncHandler>handler)(context);
	}

	// TODO - create separate file
	private static validateHandler(
		validator: Validator,
		context: Context,
		bodyType: BodyType,
		config: Config
	): Res|void {
		const { res } = context;
		function validationResponse(type: keyof Validator): Res|void {
			const validatorFn = validator[type];
			if (validatorFn) {
				const validation = validatorFn(context.req.pathParams);

				if (!validation) {
					res.set(config.validationError);
					switch (config.validationErrors) {
						case false: // Uses the default validation error
							return res;
						case 'plaintext': // Overrides the default validation error body with string
							return res.body('some message');
						// 	return res.body(`Could not process request due to the following errors in the ${type}: ${validation.errors}`);// Needs some mapping
						case 'json': { // Overrides the default validation error body with json. If already JSON, just adds/overrides the errors field
							return res.body({ // eslint-disable-next-line @typescript-eslint/ban-ts-comment
								...(typeof res.get.body === 'object' ? res.get.body : {}), // @ts-ignore
								errors: validation.errors
							});
						}
						default:
							break;
					}
					return res;
				}
			}
		}

		for (const type of ['path', 'query', 'body']) {
			if (type === 'body' && bodyType !== BodyType.JSON && bodyType !== BodyType.FormData) return;
			const response = validationResponse(type as keyof Validator);
			if (response) return response;
		}
	}

	public static async respond(
		resolvedHandler: ResolvedHandler,
		context: Context,
		config: Config,
		middleware: MiddlewareHandler[]
	): Promise<Response> {
		const { handler, path, config: handlerConfig, middleware: handlerMiddleware, validator } = resolvedHandler;

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

		Req.parsePathParams(context.req, path);
		combinedConfig.parseBody && (await Req.parseBody(context.req, combinedConfig.parseBody));
		const bodyType = this.getBodyType(context.req.body || null);
		const handlerResponse = await this.executeHandlers(
			context, handler, combinedMiddleware, bodyType, combinedConfig, validator
		);
		return this.generateResponse(handlerResponse, combinedConfig, bodyType);
	}
}
