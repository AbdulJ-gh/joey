import { DefaultError } from '../../../Utilities/general/statuses';
import { Responder } from '../../Responder';
import { Res } from '../../Res';


export function handleError(defaultError: DefaultError): Response {
	if (typeof defaultError === 'number') {
		return Responder.error(new Res().error(defaultError));
	} else {
		const { status, body, error, additionalData } = defaultError;
		return Responder.error(new Res().error(status, body, error, additionalData));
	}
}
