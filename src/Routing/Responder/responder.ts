import { isTypedArray } from '../helpers';
import { Res, type ResponseBody } from '../Res';
import type { BodyType, TypedArray } from './types';

export class Responder extends Res {
	constructor(res: Res) {
		super();
		Object.assign(this, res);
	}

	private static getBodyType(body: ResponseBody): BodyType {
		if (body === null) return 'noContent';
		if (typeof body === 'string') return 'plaintext';
		if (body instanceof FormData || body instanceof URLSearchParams) return 'formData';
		if (body instanceof ArrayBuffer) return 'arrayBuffer';
		if (isTypedArray(body)) return 'typedArray';
		return 'json';
	}

	private static setContentType(headers: Headers, contentType: string) {
		if (!headers.has('content-type')) {
			headers.set('content-type', contentType);
		}
	}

	public respond(): Response {
		const { _body, _status, headers } = this;
		const bodyType = Responder.getBodyType(_body);
		const init = { status: _status || 200, headers };

		switch (bodyType) {
			case 'json':
				Responder.setContentType(headers, 'application/json');
				return new Response(JSON.stringify(_body, null, this._pretty ? 2 : 0), init);
			case 'plaintext':
				Responder.setContentType(headers, 'text/plain; charset=utf-8');
				return new Response(_body as string, init);
			case 'formData':
				Responder.setContentType(headers, 'multipart/form-data');
				return new Response(_body as FormData, init);
			case 'arrayBuffer':
				Responder.setContentType(headers, 'application/octet-stream');
				return new Response(_body as ArrayBuffer, init);
			case 'typedArray':
				return new Response((_body as TypedArray).buffer, init);
			case 'noContent':
			default:
				return new Response(null, { status: this._status ? this._status : 204, headers });
		}
	}
}
