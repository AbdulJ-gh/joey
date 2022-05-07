import { MiddlewareHandler } from '../types';

type Env = { a: number }
type Deps = { fauna: string }

// Option 1 - extend from Record
type T = Record<string, unknown> & { clientId: string };
// Option 2 - Predefine all types
type T2 = { clientId: string, auth: number}

const MiddleName: MiddlewareHandler<Env, Deps, T> = ({
	req,
	res,
	env,
	deps: { fauna } = { fauna: 'djklhjklsd' }
}) => {
	console.log(fauna, res, env);
	req.customFields = {
		auth: 100,
		clientId: 'string'
	};
};

export default MiddleName;
