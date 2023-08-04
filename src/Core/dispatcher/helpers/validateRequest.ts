import { sizeLimit } from './sizeLimit';
import { getBodyType } from './getBodyType';
import { validationHandler } from './validationHandler';
import type { RegisteredHandler, Config } from '../../types';
import type Context from '../../context';

/** ---- Validation ----
 * Check size limit, weird place to do this, it's too implementation detaily
 * Validate request path, query and body
 * */
export function validateRequest(registeredHandler: RegisteredHandler, context: Context) {
	const { config, validator } = registeredHandler as RegisteredHandler<Config>;

	const sizeLimitResponse = sizeLimit(context.req.url, config);
	if (sizeLimitResponse) return sizeLimitResponse;
	if (validator) {
		const bodyType = getBodyType(context.req.body || null);
		const response = validationHandler(validator, context, bodyType, config);
		if (response) return response;
	}
}
