import { DefaultError } from '../config';
import { Res } from '../Res';

export function handleSystemError(error: DefaultError, prettify: boolean): Res {
	if (typeof error === 'number') {
		return new Res(null, error);
	}
	return new Res(error.body, error.status, error.headers || {}, prettify);
}
