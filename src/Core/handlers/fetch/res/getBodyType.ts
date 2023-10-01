import type { HandlerBodyType, BodyType } from '../types';

export function getBodyType(body?: BodyType): HandlerBodyType {
	if (body === null || body === undefined) { return null; }
	if (typeof body === 'string') { return 'plaintext'; }
	if (body instanceof FormData) { return 'formData'; }
	if (body instanceof URLSearchParams) { return 'urlEncodedFormData'; }
	if (body instanceof Blob) { return 'blob'; }
	if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) { return 'arrayBuffer'; }
	return 'json';
}
