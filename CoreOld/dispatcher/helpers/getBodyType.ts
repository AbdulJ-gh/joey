import type { ResponseBody } from '../../res';
import { BodyType } from '../../types';
import { isTypedArray } from './isTypedArray';

export function getBodyType(body: ResponseBody): BodyType {
	// if (body === null) return BodyType.NoContent;
	// if (typeof body === 'string') return BodyType.Plaintext;
	// if (body instanceof FormData) return BodyType.FormData;
	// if (body instanceof URLSearchParams) return BodyType.UrlEncodedFormData;
	// if (body instanceof Blob) return BodyType.Blob;
	// if (ArrayBuffer.isView(body) || body instanceof ArrayBuffer) return BodyType.ArrayBuffer;
	// if (isTypedArray(body)) return BodyType.TypedArray;
	return BodyType.JSON;
}


// THIS ONE IS USED IN BOTH:
// validateRequest
// transformResponse


// 	NoContent = 'noContent', // no body or null json
// 	Plaintext =	'plaintext', // text(): Promise<string>;
// 	FormData = 'formData' // formData(): Promise<FormData>;
// 	UrlEncodedFormData = 'urlEncodedFormData', // formData(): Promise<FormData>; ??? For Response body only?
// 	Blob = 'blob', // blob(): Promise<Blob>;
// 	ArrayBuffer = 'arrayBuffer', // arrayBuffer(): Promise<ArrayBuffer>;
// 	TypedArray = 'typedArray', // arrayBuffer(): Promise<ArrayBuffer>; ?? For Response body only?
// 	JSON = 'json', // json<T>(): Promise<T>;
