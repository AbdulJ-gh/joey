export declare type BodyType = 'json' | 'plaintext' | 'formData';
export declare type JsonBody = Record<string, unknown> | unknown[];
export declare type ResponseBody = JsonBody | string | FormData;
export declare type ErrorBody = JsonBody | string
export declare type ErrorType = Error | string

export type ResProperties = {
  body: ResponseBody;
  status: number;
  headers: HeadersInit;
  pretty: boolean;
};
