import statuses, { Status } from '../../Utilities/general/statuses';
import { BodyType, JsonBody } from './types';

export class Res {
	protected pretty: boolean = false;
	protected _bodyType: BodyType = 'json';
	protected _status: Status = 200;
	protected _body: JsonBody = {};
	public _headers: Headers = new Headers();

	constructor(body?: JsonBody, status?: Status, headers?: HeadersInit, pretty?: boolean) {
		this._body = body || {};
		this._status = status || 200;
		this._headers = new Headers(headers || {});
		this.pretty = pretty || false;
	}

	*[Symbol.iterator]() {
		const items: any[] = [this._body, this._status, this._headers, this.pretty];
		for (let i of items) {
			yield i;
		}
	}

	public prettify(): this {
		this.pretty = true;
		return this;
	}
	public bodyType = (bodyType: BodyType): this => {
		this._bodyType = bodyType;
		return this;
	};

	public body = (body: JsonBody): this => {
		this._body = body;
		return this;
	};
	public status = (status: Status): this => {
		this._status = status;
		return this;
	};
	public headers = (headers: HeadersInit): this => {
		this._headers = new Headers(headers);
		return this;
	};

	public set(body: JsonBody, status?: Status, headers?: HeadersInit): this {
		this._body = body;
		status && this.status(status);
		headers && this.headers(headers);
		return this;
	}

	public error(status: Status, message?: string): this {
		this._status = status;
		this._body = {
			success: false,
			message: message ? message : statuses[status]
		};

		return this;
	}
}
