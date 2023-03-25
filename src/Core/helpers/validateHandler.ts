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
			console.log('Running validation for ' + type);
			console.log('Context is', context);
			// const validation = validatorFn(context.req.queryParams as Record<string, string>); // Todo - this should be dynamic
			const validation = validatorFn(context.req.body as Record<string, string>);
			console.log('validation', validation);

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
							...(typeof res.get.body === 'object' ? res.get.body : {}), // @ts-ignore
							errors: (validatorFn.errors as [{ instancePath: string, message: string }])
								.map(error => ({
									path: error.instancePath,
									message: error.message
								})
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
