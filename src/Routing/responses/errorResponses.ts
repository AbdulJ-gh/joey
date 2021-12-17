import { Res } from '../Res';

export function badRequest(): Res {
	return new Res({ success: false, message: 'Bad Request' }, 400);
}

export function unauthorized(): Res {
	return new Res({ success: false, message: 'unauthorized' }, 401);
}

export function forbidden(): Res {
	return new Res({ success: false, message: 'Forbidden' }, 403);
}

export function notFound(): Res {
	return new Res({ success: false, message: 'Not found' }, 404);
}

export function methodNotAllowed(): Res {
	return new Res({ success: false, message: 'Method Not allowed' }, 405);
}

export function tooManyRequests(): Res {
	return new Res({ success: false, message: 'Too many requests' }, 429);
}

export function internalServerError(): Res {
	return new Res({ success: false, message: 'Internal server error' }, 500);
}

export function serviceUnavailable(): Res {
	return new Res({ success: false, message: 'Service unavailable' }, 503);
}
