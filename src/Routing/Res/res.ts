import statuses, { Status } from '../../Utilities/general/statuses';
import { BodyType, JsonBody } from './res.types';

export class Res {
	protected pretty: boolean = false;
	protected bodyType: BodyType = 'json';
	protected status: Status = 200;
	protected body: JsonBody = {};
	public headers: Headers = new Headers();

	constructor(body?: JsonBody, status?: Status, headers?: HeadersInitializer, pretty?: boolean) {
		this.body = body || {};
		this.status = status || 200;
		this.headers = new Headers(headers || {});
		this.pretty = pretty || false;
	}

	*[Symbol.iterator]() {
		const items: any[] = [this.body, this.status, this.headers, this.pretty];
		for (let i of items) {
			yield i;
		}
	}

	public prettify(): this {
		this.pretty = true;
		return this;
	}
	public setBodyType = (bodyType: BodyType): this => {
		this.bodyType = bodyType;
		return this;
	};

	public setBody = (body: JsonBody): this => {
		this.body = body;
		return this;
	};
	public setStatus = (status: Status): this => {
		this.status = status;
		return this;
	};
	public setHeaders = (headers: HeadersInitializer): this => {
		this.headers = new Headers(headers);
		return this;
	};

	public set(body: JsonBody, status?: Status, headers?: HeadersInitializer): this {
		this.body = body;
		status && this.setStatus(status);
		headers && this.setHeaders(headers);
		return this;
	}

	public error(status: Status, message?: string): this {
		this.status = status;
		this.body = {
			success: false,
			message: message ? message : statuses[status]
		};

		return this;
	}
}
