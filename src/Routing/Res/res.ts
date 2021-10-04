export declare type JsonBody = Record<string, any> | any[];

export default class Res {
	private pretty: boolean = false;
	private status: number = 200;
	private body: JsonBody = {};
	private headers: Headers = new Headers();
}

// Have a res.error(ErrorResponse), which sets res.end to true and sets the body etc. And this needs a way to hook in to error logging waitUntil etc
