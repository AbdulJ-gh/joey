import { Res } from '../Res';

export class Responder extends Res {
	constructor(res: Res) {
		super(...res);
	}

	public send(): Response {
		const { _body, _bodyType, pretty, _status, _headers } = this;

		if (this.isClientError(_status)) {
			// Do telemetry stuff
		}

		const jsonSend = () =>
			new Response(JSON.stringify(_body, null, pretty ? 2 : 0), {
				status: _status,
				headers: _headers
			});

		switch (_bodyType) {
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
