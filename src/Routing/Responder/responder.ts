import Res from '../Res';

type BodyType = 'json' | 'formData' | 'arrayBuffer' | 'blob' | 'text';

export default class Responder extends Res {
	// private readonly req: Request
	// public respond: handler

	constructor(res: Res) {
		super(res);
	}

	public send() {
		const { body, pretty, status, headers } = this;
		switch (this.bodyType) {
			case 'json':
				return new Response(JSON.stringify(body, null, pretty ? 2 : 0), { status, headers });
			default:
				return new Response(JSON.stringify(body, null, pretty ? 2 : 0), { status, headers });
		}
	}
}
