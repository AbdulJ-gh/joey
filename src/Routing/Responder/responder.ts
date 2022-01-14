import { Res, type ResponseBody } from '../Res';
import type { BodyType } from './types';

export class Responder extends Res {
	constructor(res: Res) {
		super(...res as unknown as [ResponseBody, number, Headers, boolean]);
	}

	private static getBodyType(body: ResponseBody): BodyType {
		if (body === null) return 'noContent';
		if (typeof body === 'string') return 'plaintext';
		if (body instanceof FormData || body instanceof URLSearchParams) return 'formData';
		if (body instanceof ArrayBuffer) return 'arrayBuffer';
		return 'json';
	}

	private static setContentType(headers: Headers, contentType: string) {
		if (!headers.has('Content-Type')) {
			headers.set('Content-Type', contentType);
		}
	}

	public respond(): Response {
		const { _body, _status, headers } = this;
		const bodyType = Responder.getBodyType(_body);
		const init = { status: _status, headers };

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
			case 'noContent':
			default:
				return new Response(null, { status: 204, headers });
		}
	}

	// Todo - review
	public isError() {
		const status = this.status.toString();
		return status.startsWith('4') || status.startsWith('5');
	}

	// Todo - review
	static error(error: Res|Error|unknown): Response {
		if (error instanceof Res) return new Responder(error).respond();
		return new Responder(new Res('Server Error', 500)).respond();
	}
}
