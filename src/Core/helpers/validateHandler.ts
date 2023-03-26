import { BodyType, Validator } from '../types';
import Context from '../context';
import { Config } from '../config';
import { Res } from '../res';

export function validateHandler(
	validator: Validator,
	context: Context,
	bodyType: BodyType,
	config: Config
): Res|void {
	const { res } = context;

	function validationResponse(type: keyof Validator): Res | void {
		const validatorFn = validator[type];
		if (validatorFn) {
			const reqKeyMap: Record<keyof Validator, 'body'|'queryParams'|'pathParams'> = {
				body: 'body',
				query: 'queryParams',
				path: 'pathParams'
			};
			const validation = validatorFn(context.req[reqKeyMap[type]] as Record<string, string>);

			if (!validation) {
				res.set(config.validationError);
				switch (config.validationErrors) {
					case false: // Uses the default validation error
						return res;
					case 'plaintext': // Overrides the default validation error body with string
						return res.body('some message');
					// 	return res.body(`Could not process request due to the following errors in the ${type}: ${validation.errors}`);// Needs some mapping
					case 'json': { // Overrides the default validation error body with json. If already JSON, just adds/overrides the errors field
						console.log('FAILED FOR TYPE', type);
						return res.body({ // eslint-disable-next-line @typescript-eslint/ban-ts-comment
							...(typeof res.get.body === 'object' ? res.get.body : {}), // @ts-ignore // Todo, array also is 'object'
							errors: (validatorFn.errors as [{ instancePath: string, message: string }])
								.map(error => {
									console.log('THIS ERROR IS', error);
									return {
										location: type,
										path: error.instancePath,
										message: error.message
									};
								}
								)
						});
					}
					default:
						break;
				}
				return res;
			}
		}
	}

	for (const type of ['path', 'query', 'body']) {
		// if (type === 'body' && bodyType !== BodyType.JSON && bodyType !== BodyType.FormData) return;
		const response = validationResponse(type as keyof Validator);
		if (response) return response;
	}
}
