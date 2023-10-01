import type { Params } from '../../../Utilities';
import type { DeserialisedJson, ResponseLike } from './types';
import type { FetchContext } from './context';
import { ConfigInstance } from '../../config';
import { Res } from './res';
import { HandlerBodyType } from './types';

type ValidatorFn<DATA = unknown> = (data: DATA) => boolean;
// AJV Validator returns a boolean but create an errors property within the function

export type Validator = {
	path?: ValidatorFn<Params>,
	query?: ValidatorFn<Params>,
	body?: ValidatorFn<DeserialisedJson>, // Only supports JSON body validation for now. Add FormData and URLSearchParams?
}

type AjvError = {
	keyword: string;
	message: string;
}

type Thing<DATA = unknown> = {
	validator?: ValidatorFn<DATA>;
	data: DATA;
}

export function validationHandler(
	context: FetchContext,
	reqBodyType: HandlerBodyType,
	validator?: Validator
): ResponseLike | void {
	if (!validator) {
		return;
	}
	const {
		options: { validationErrors, allValidationErrors },
		defaultErrors: { validationError: { body, status, headers } }
	} = ConfigInstance;

	const things: Thing[] = [
		{ validator: validator.path as ValidatorFn, data: context.req.pathParams },
		{ validator: validator.query as ValidatorFn, data: context.req.queryParams }
	];
	if (reqBodyType === 'json') {
		things.push({ validator: validator.body as ValidatorFn, data: context.req.body });
	}

	for (const thing of things) {
		if (thing.validator) {
			const validation = thing.validator(thing.data);
			if (!validation) {
				if (validationErrors && body !== null) {
					const errorsMessages = allValidationErrors // @ts-ignore
						? collateErrorsMessages(validation.errors) // @ts-ignore
						: getFirstErrorMessage(validation.errors);

					let responseBody = body;
					if (!responseBody) {
						responseBody = {};
					}

					if (typeof responseBody === 'string') {
						const message = typeof errorsMessages === 'string' ? errorsMessages : errorsMessages.join('\n');
						responseBody = responseBody.concat('\n', message);
					} else if (!responseBody.errors) {
						responseBody.errors = errorsMessages;
					}

					return new Res(responseBody, status, headers);
				}
			}
		}
	}
}


function collateErrorsMessages(errors: AjvError[]): string[] {
	const original: string[] = [];
	const generated: string[] = [];

	for (const error of errors) {
		error.keyword === 'errorMessage'
			? generated.push(error.message)
			: original.push(error.message);
	}

	if (generated.length === 0) {
		return original;
	}

	return generated;
}

function getFirstErrorMessage(errors: AjvError[]): string {
	const generated = errors.find(error => error.keyword === 'errorMessage');
	if (generated) { return generated.message; }
	return errors[0].message;
}
