import { BodyType } from '../../types';
import type { ResponseBody } from '../../res';
import type { TypedArray } from './isTypedArray';

export function transformBody(body: ResponseBody, bodyType: BodyType, prettifyJson: boolean): BodyInit {
	if (bodyType === BodyType.JSON) {
		return JSON.stringify(body, null, prettifyJson ? 2 : 0);
	}
	if (bodyType === BodyType.TypedArray) { return (body as TypedArray).buffer; }
	return body as BodyInit;
}
