import test from 'ava';
import { generateMockContext } from '../../../testUtils/generateMockContext';
import { generateMockRequest } from '../../../testUtils/generateMockRequest';
import { getAllQueryParams } from '../../Utilities/queryParams';
import { Req } from '../Req';
import { Res } from '../Res';
import { type ResolvedHandler, Router } from '../Router';
import { Dispatcher } from './dispatcher';

test('Dispatcher - Properties', async t => {
	// const router = new Router();
	//
	// router.use(({ req }) => {
	// 	console.log('\nFirst');
	// 	console.log('URRRLLLL', req.url);
	// 	req.queryParams = getAllQueryParams(new URL(req.url));
	// });
	//
	// router.use(async ({ req, next, event }) => {
	// 	console.log('\nSecond');
	// 	const accepts = req.headers.get('content-type');
	// 	if (req.body && accepts?.includes('json')) {
	// 		console.log('GETS HERE?');
	// 		req.tempBody = await req.clone().json();
	// 	}
	//
	// 	console.log('VALUEEE ISSSS', await next());
	// });
	//
	// router.use(({ next }) => {
	// 	console.log('\nThird');
	// 	// next();
	// 	return 'THIS SHOULD LOG FROM THE SECOND ONE AFTER I HAVE LOGGED THIRD';
	// });
	//
	// const dispatcher = new Dispatcher(router);
	// const req = new Req(
	// 	generateMockRequest('/path?a=100&b=200&a=300', 'POST', { some: 'data' }, { 'content-type': 'application/json' })
	// );
	// const context = generateMockContext(req);
	// const resolvedHandler: ResolvedHandler = {
	// 	handler: ({ req, res }) => {
	// 		console.log('\n\nTHIS IS THE HANDLER');
	// 		console.log(req.queryParams);
	// 		console.log(req.tempBody);
	// 		console.log('\n');
	// 		return res;
	// 	},
	// 	authenticate: false,
	// 	routerContext: router,
	// 	absolutePath: '/'
	// };
	//
	// await dispatcher.handleResponse(context, resolvedHandler);
	t.pass();
});
