import { JsonBody } from '../Res';

export declare type PathParams = Record<string, string | string[]>;

// export declare type RequestBody = Body | string | JsonBody | FormData | Blob | ArrayBuffer | null;

export declare type RequestBody = ReadableStream | Body | string | JsonBody | FormData | URLSearchParams | Blob | ArrayBuffer | null;

export declare type BodyType = 'plaintext' | 'json' | 'formData' | 'blob' | 'buffer' | null;


type R =
	| Body
	| JsonBody
	| string
	| ArrayBuffer
	| FormData
	| Blob
	| null;


declare type BodyInit =
	| ReadableStream 	// --> ? Ignore ?
	| string			// --> string
	| ArrayBuffer		// --> ArrayBuffer
	| Blob				// --> Blob
	| URLSearchParams	// --> Object
	| FormData;			// --> Object
