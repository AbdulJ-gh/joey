import type { ErrorObject, ValidateFunction } from 'ajv';
import { BodyType } from '../../types';
import type { Config, Validator } from '../../types';
import type Context from '../../context';
import type { Res, ResponseObject } from '../../res';

export function validationHandler(
	validator: Validator,
	context: Context,
	bodyType: BodyType,
	config: Config
): Res | void {
	const { res } = context;

	function validationResponse(type: keyof Validator): Res | void {
		const validatorFn = validator[type] as ValidateFunction;
		if (validatorFn) {
			const reqKeyMap: Record<keyof Validator, 'body'|'queryParams'|'pathParams'> = {
				body: 'body',
				query: 'queryParams',
				path: 'pathParams'
			};

			const validation = validatorFn(context.req[reqKeyMap[type]] as Record<string, string>);

			if (!validation) {
				res.set(config.validationError as ResponseObject);
				switch (config.validationErrors) {
					case 'plaintext':
						// Overrides the default validation error body with string
						return res.body(
							config.allValidationErrors
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								? `The following validation error(s) occurred in the ${type}: ${validatorFn.errors}`
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								: `The following validation error occurred in the ${type}: ${(validatorFn.errors as ErrorObject[])[0]}`
						);
					case 'json': {
						// Overrides the default validation error body with json. If already JSON, just adds/overrides the errors field
						return res.body({
							message: 'Could not process request due to validation errors',
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							errors: config.allValidationErrors ? validatorFn.errors : (validatorFn.errors as ErrorObject[])[0]
						});
					}
					case false:
					default:
						break;
				}
				return res;
			}
		}
	}

	for (const type of ['path', 'query', 'body']) {
		if (type === 'body' && bodyType !== BodyType.JSON && bodyType !== BodyType.FormData) return;
		const response = validationResponse(type as keyof Validator);
		if (response) return response;
	}
}
