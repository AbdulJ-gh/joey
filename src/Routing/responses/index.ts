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

export default {
	clientError: {
		badRequest,
		unauthorized,
		forbidden,
		notFound,
		methodNotAllowed,
		tooManyRequests
	},
	serverError: {
		internalServerError,
		serviceUnavailable
	}
};
