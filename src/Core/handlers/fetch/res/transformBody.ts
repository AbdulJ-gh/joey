import type { BodyType, HandlerBodyType } from '../types';
import type { BodyInit } from '@cloudflare/workers-types';
import { ConfigInstance } from '../../../config';

export function transformBody(bodyType: HandlerBodyType, body?: BodyType): BodyInit|null {
	if (body === undefined) {
		return null;
	}

	if (bodyType === 'json') {
		return JSON.stringify(body, null, ConfigInstance.options.prettifyJson ? 2 : 0);
	}

	return body as BodyInit;
}
