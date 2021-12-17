import { Res } from '../Res';

export class Responder extends Res {
	constructor(res: Res) {
		super(...res);
	}

	public send(): Response {
		const { body, pretty, status, headers } = this;

		if (this.isClientError(status)) {
			// Do telemetry stuff
		}

		const jsonSend = () => new Response(JSON.stringify(body, null, pretty ? 2 : 0), { status, headers });

		switch (this.bodyType) {
			case 'json':
				return jsonSend();
			default:
				return jsonSend();
		}
	}

	private isClientError(status: number): boolean {
		return status.toString().startsWith('4');
	}
}

// TODO - encoding/compression, cache, keep-alive, case sensitivity for url paths
