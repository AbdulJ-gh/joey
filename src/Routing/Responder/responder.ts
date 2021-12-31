import { Res } from '../Res';
import type { ResponseBody } from '../Res';
import type { BodyType } from './types';

export class Responder extends Res {
	constructor(res: Res) {
		super(res.body, res.status, res.headers, res.pretty);
	}

	static getBodyType(body: ResponseBody): BodyType {
		if (body === null) return 'noContent';
		if (typeof body === 'string') return 'plaintext';
		if (body instanceof FormData) return 'formData';
		return 'json';
	}

	static error(error: Res|Error|unknown): Response {
		// Do telemetry here
		if (error instanceof Res) return new Responder(error).respond();
		return new Responder(new Res('Server Error', 500)).respond();
	}

	private static setContentType(headers: Headers, contentType: string) {
		if (!headers.has('Content-Type')) {
			headers.set('Content-Type', contentType);
		}
	}

	public respond(): Response {
		const { body, pretty, status, headers } = this;
		const bodyType = Responder.getBodyType(body);

		switch (bodyType) {
			case 'json':
				Responder.setContentType(headers, 'application/json;charset=utf-8');
				return new Response(JSON.stringify(body, null, pretty ? 2 : 0), { status, headers });
			case 'plaintext':
				Responder.setContentType(headers, 'text/plain;charset=utf-8');
				return new Response(body as string, { status, headers });
			case 'formData':
				Responder.setContentType(headers, 'multipart/form-data');
				return new Response(body as FormData, { status, headers });
			default:
				return new Response(null, { status: status === 200 ? 204 : status, headers });
		}
	}
}
