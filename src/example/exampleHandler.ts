import { Handler } from '../types';
import { Env } from './env.types';
// import { cookie } from '../../Utilities/headers';
import { generateToken } from '../../Crypto';
import { dependencies, Deps } from './deps';
// Need a link to the types file in the package.json, and those types must not use the export keyword


// type Deps = typeof dependencies;

type Req = {
	clientId: string;
	auth: {
		clientId: string;
	};
};

// Cookie and generateToken do not need to be injected, because they are local static functions that won't need to be mocked in tests

// To skip some could be either: <Env, unknown, Auth> OR <Env, null Auth>

const functionName: Handler<Env, Deps, Req> = ({
	req,
	res,
	logger,
	env,
	deps: { cache, fauna } = dependencies
}) => {
	console.log(req, logger, res);
	const { headers, cookie	} = res;
	const { Authorization } = req.cookies;
	const { auth: { clientId } } = req.additionalFields;

	req.additionalFields.clientId = '100';

	// const Authorization = req.cookie.get('Authorization')
	// req.random = 100

	headers.append('hello', 'world');

	const {
		auth: ReqAuth,
		'content-type': contentType
	} = req.headers;

	// Could I somehow use this object and return it somehow and use that as an allowedHeader check? obviously with the option to not do the check you dont


	// const contentType = req.headers.get('content-type');
	logger.log(cache, fauna, clientId);
	logger.log(ReqAuth, contentType);

	console.log(
		cache /* Will I need a reference the the current url to fetch/set the cache */,
		fauna
	);
	console.log(env.ENVIRONMENT);
	console.log(env.KV_NS.API_KEY);
	console.log(env.KV_NS.API_KEY);

	cookie.set('Authorization', 'Bearer ' + 'abcdef0123456789');
	const token = generateToken(16);

	const obj = {
		a: 100,
		b: 200,
		c: 300
	};

	if (obj.a === 1001) {
		return {
			status: 200,
			body: 'string',
			headers
		};
	} else {
		return res.status(200).body(obj);
	}
};

export default functionName;

// return {
// 	status: 200,
// 	body: 'string',
// 	headers
// };
// return { body: 'string' };

// return res
// 	.body('Hello world')
// 	.status(200);
