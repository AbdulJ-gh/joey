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

	static handleError(error: Res|Error|unknown): Response {
		// Do telemetry here
		if (error instanceof Res) {
			console.log('Do A');
		} else if (error instanceof Error) {
			console.log('Do B');
		} else {
			console.log('Do C');
		}

		return new Response();
	}

	public respond(): Response {
		const { body, pretty, status, headers } = this;
		const bodyType = Responder.getBodyType(body);

		const jsonSend = () => new Response(JSON.stringify(body, null, pretty ? 2 : 0), { status, headers });
		const textSend = () => {
			headers.set('Content-Type', 'text/plain');
			return new Response(body as string, { status, headers });
		};
		const formSend = () => {
			headers.set('Content-Type', 'multipart/form-data');
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
