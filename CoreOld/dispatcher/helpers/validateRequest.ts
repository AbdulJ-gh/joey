import { sizeLimit } from './sizeLimit';
// import { getBodyType } from './getBodyType';
// import { validationHandler } from './validationHandler';
import type { RegisteredHandler, Config, ResponseLike } from '../../types';
import type Context from '../../context';

/** ---- Validation ----
 * Check size limit, weird place to do this, it's too implementation detaily
 * Validate request path, query and body
 * */
export function validateRequest(registeredHandler: RegisteredHandler, context: Context): ResponseLike | void {
	// const { config, validator } = registeredHandler as RegisteredHandler<Config>;
	const { config } = registeredHandler as RegisteredHandler<Config>;
	const sizeLimitResponse = sizeLimit(context.req.url, config);
	if (sizeLimitResponse) return sizeLimitResponse;
	// if (validator) { // TODO - Refactor
	const bodyType = getBodyType(context.req.body);
	const response = validationHandler(validator, context, bodyType, config);
	// 	if (response) return response;
	// }
}
