import { getHeadersInstance } from '../../../src/Utilities/headers';
import { BodyType } from '../../types';

/**
 * Cannot set content type for Response type because body is already transformed
 * For any response, manually setting the content type header will override these defaults. For example `text/html` for plaintext content.
 * Essentially the default content types will match the data correctly, but might not be specific enough for your needs.
 */
export function setContentType(bodyType: BodyType, headers: Headers|Record<string, string>): void {
	let contentType;
	if (!getHeadersInstance(headers).has('content-type')) {
		switch (bodyType) {
			case BodyType.JSON:
				contentType = 'application/json';
				break;
			case BodyType.Plaintext:
				contentType = 'text/plain; charset=utf-8';
				break;
			case BodyType.FormData:
				contentType = 'multipart/form-data';
				break;
			case BodyType.UrlEncodedFormData:
				contentType = 'application/x-www-form-urlencoded';
				break;
			case BodyType.ArrayBuffer:
			case BodyType.TypedArray:
				contentType = 'application/octet-stream';
				break;
			case BodyType.NoContent:
			default:
				break;
		}
	}
	if (contentType) {
		headers instanceof Headers
			? headers.set('content-type', contentType)
			: headers['content-type'] = contentType;
	}
}
