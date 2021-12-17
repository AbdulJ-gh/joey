import {
	badRequest,
	unauthorized,
	forbidden,
	notFound,
	methodNotAllowed,
	tooManyRequests,
	internalServerError,
	serviceUnavailable
} from './errorResponses';

export const clientError = {
	badRequest,
	unauthorized,
	forbidden,
	notFound,
	methodNotAllowed,
	tooManyRequests
};

export const serverError = { internalServerError, serviceUnavailable };
