export declare type JsonBody = Record<string, unknown> | unknown[];
export declare type ResponseBody =
	| string
	| ArrayBuffer
	| Blob
	| URLSearchParams
	| FormData
	| JsonBody
	| null;
// @cf declare type BodyInit = ReadableStream | string | ArrayBuffer | Blob | URLSearchParams | FormData;

export declare type ErrorBody = JsonBody | string | null;
export declare type ErrorType = Error | string | null;
export declare type AdditionalData = Record<string, unknown> | null;

export declare type ResProperties = {
	body: ResponseBody;
	status: number;
	headers: HeadersInit;
	pretty: boolean;
	error: unknown;
};

export declare type ResGetter = Omit<ResProperties, 'headers'>;
