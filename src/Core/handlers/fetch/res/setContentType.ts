import type { HandlerBodyType } from '../types';
import type { ResponseObject } from './res';

const contentTypeMap: Record<Exclude<HandlerBodyType, null>, string> = {
	plaintext: 'text/plain; charset=utf-8',
	formData: 'multipart/form-data',
	urlEncodedFormData: 'application/x-www-form-urlencoded',
	blob: 'application/octet-stream',
	arrayBuffer: 'application/octet-stream',
	json: 'application/json'
};

export function setContentType(bodyType: HandlerBodyType, headers: ResponseObject['headers']): void {
	if (bodyType) {
		const [name, value] = ['content-type', contentTypeMap[bodyType]];
		if (headers instanceof Headers && !headers.has(name)) {
			headers.set(name, value);
		} else if (!Array.isArray(headers) && !(<Record<string, string>>headers)[name]) {
			(<Record<string, string>>headers)[name] = value;
		} else {
			const index = (<string[][]>headers).findIndex(pair => pair[0] === name);
			if (index === -1) {
				(<string[][]>headers).push([name, value]);
			}
		}
	}
}
