import { Res } from '../Res';
import { BodyType, ResponseBody } from '../Res/types';

export class Responder extends Res {
	constructor(res: Res) {
		super(res.body, res.status, res.headers, res.pretty);
	}

	static getBodyType(body: ResponseBody): BodyType {
		if (typeof body === 'string') return 'plaintext';
		if (body instanceof FormData) return 'formData';
		return 'json';
	}

	static error(error: Res|Error|unknown): Response {
		// Do telemetry here
		if (error instanceof Res) return new Responder(error).respond();
		return new Responder(new Res('Server Error', 500)).respond();
	}

	private setContentType(headers: Headers, contentType: string) {
		if (!headers.has('Content-Type')) {
			headers.set('Content-Type', contentType);
		}
	}

	public respond(): Response {
		const { body, pretty, status, headers } = this;
		const bodyType = Responder.getBodyType(body);

		const jsonSend = () => {
			this.setContentType(headers, 'application/json');
			return new Response(JSON.stringify(body, null, pretty ? 2 : 0), { status, headers });
		};
		const textSend = () => {
			this.setContentType(headers, 'text/plain');
			return new Response(body as string, { status, headers });
		};
		const formSend = () => {
			this.setContentType(headers, 'multipart/form-data');
			return new Response(body as FormData, { status, headers });
		};

		switch (bodyType) {
			case 'json':
				return jsonSend();
			case 'plaintext':
				return textSend();
			case 'formData':
				return formSend();
			default:
				return jsonSend();
		}
	}
}
