export declare type JsonBody = Record<string, unknown> | unknown[];
export declare type ResponseBody = JsonBody | string | FormData | null;
export declare type ErrorBody = JsonBody | string
export declare type ErrorType = Error | string

export declare type ResProperties = {
	body: ResponseBody;
	status: number;
	headers: HeadersInit;
	pretty: boolean;
};
