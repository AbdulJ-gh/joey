import { MiddlewareHandler } from '../Core';

type Req = { clientId: string, auth: number}


const Validator: MiddlewareHandler<unknown, unknown, Req> = ({ req }) => {
	console.log(req.additionalFields.auth);

	switch (req.route) {
		case 'name-of-handler': {
			const body = validate(
				req.validators['some-body'],
				req.body,
				'Incorrect body'
			);

			const qps = validate(
				req.validators['some-other-body'],
				req.body,
				'Missing required Query Params'
			);

			return body || qps;
		}
		case 'name-of-handler-2':
			return (
				validate(
					req.validators['some-body'],
					req.body,
					'Incorrect body'
				) || validate(
					req.validators['some-other-body'],
					req.body,
					'Missing required Query Params'
				)
			);
		case 'name-of-handler-3':
			return validateMany(
				[
					req.validators['some-body'],
					req.validators['some-other-body']
				], [
					req.body,
					req.queryParams
				], [
					'Incorrect Body',
					'Missing some required query parameters'
				]
			);
		case 'name-of-handler-4': {
			const validBody = req.validators['some-body'](req.body);
			const validQPs = req.validators['some-other-body'](req.queryParams);
			if (!validBody) { return BadRequest('Incorrect body'); }
			if (!validQPs) { return BadRequest('Missing required Query Params'); }
			break;
		}
		default:
			break;
	}
};

export default Validator;

/*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
* */


/* UTILS */
const BadRequest = (message: string) => ({
	status: 400,
	message
});

type val = (...args: unknown[]) => unknown

function validate(validator: val, obj: unknown, message: string) {
	if (!validator(obj)) {
		return BadRequest(message);
	}
}

function validateMany(validators: val[], objs: unknown[], messages: string[]) {
	for (let i = 0; i < validators.length; i++) {
		if (!validators[i](objs[i])) {
			return BadRequest(messages[i]);
		}
	}
}
/* UTILS */
