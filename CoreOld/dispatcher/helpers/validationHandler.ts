import type { ErrorObject, ValidateFunction } from 'ajv';
import { BodyType, DeserialisedJson } from '../../types';
import type { Config } from '../../types';
import type Context from '../../context';
import type { Res, ResponseObject } from '../../res';
import type { Params } from '../../../src/Utilities';

type ValidatorFn<DATA> = (data: DATA) => boolean; // Validator returns a boolean but create an errors property within the function

export type Validator = {
	path?: ValidatorFn<Params>,
	query?: ValidatorFn<Params>,
	body?: ValidatorFn<DeserialisedJson>, // Only supports JSON body validation, and maybe form data as key value pairs only?
}

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
								// @ts-ignore
								? `The following validation error(s) occurred in the ${type}: ${validatorFn.errors}`
								// @ts-ignore
								: `The following validation error occurred in the ${type}: ${(validatorFn.errors as ErrorObject[])[0]}`
						);
					case 'json': {
						// Overrides the default validation error body with json. If already JSON, just adds/overrides the errors field
						return res.body({
							message: 'Could not process request due to validation errors',
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
