import { BodyType, JsonBody } from '../../types';

export class Res {
	protected pretty: boolean = false;
	protected bodyType: BodyType = 'json';
	protected status: number = 200;
	protected body: JsonBody = {};
	public headers: Headers = new Headers();

	constructor(body?: JsonBody, status?: number, headers?: HeadersInitializer, pretty?: boolean) {
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
	// ISSUE HERE, it is always asking for JsonBody, but the Res might be of a different kind
	public setBody = (body: JsonBody): this => {
		this.body = body;
		return this;
	};
	public setStatus = (status: number): this => {
		this.status = status;
		return this;
	};
	public setHeaders = (headers: HeadersInitializer): this => {
		this.headers = new Headers(headers);
		return this;
	};

	public set(body: JsonBody, status?: number, headers?: HeadersInitializer): this {
		this.body = body;
		status && this.setStatus(status);
		headers && this.setHeaders(headers);
		return this;
	}
}

// Have a res.error(ErrorResponse), which sets res.end to true and sets the body etc. And this needs a way to hook in to error logging waitUntil etc
