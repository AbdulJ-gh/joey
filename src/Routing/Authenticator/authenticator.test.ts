import test from 'ava';
import { generateMockContext } from '../../../testUtils/generateMockContext';
import { Authenticator } from './index';


test('Authenticator - PASS', t => {
	t.pass();
});

// test('Authenticator - Properties', t => {
// 	const authHandler = () => null;
// 	const authenticator = new Authenticator(authHandler);
// 	t.is(authenticator.authHandler, authHandler);
// });
//
// test('Authenticator - Handler returns data', async t => {
// 	const context = generateMockContext();
// 	const authenticator = new Authenticator(() => ({ some: 'data' }));
// 	t.deepEqual(authenticator.authHandler(context), { some: 'data' });
// 	t.is(await authenticator.authenticate(context), undefined);
// 	t.deepEqual(context.req.auth, { some: 'data' });
// });
//
// test('Authenticator - Handler returns null', async t => {
// 	const context = generateMockContext();
// 	const authenticator = new Authenticator(() => null);
// 	t.deepEqual(authenticator.authHandler(context), null);
// 	t.is(await authenticator.authenticate(context), undefined);
// 	t.is(context.req.auth, null);
// });
//
// test('Authenticator - return Res directly', async t => {
// 	const context = generateMockContext();
// 	const authenticator = new Authenticator(({ res }) => res);
// 	t.is(authenticator.authHandler(context), context.res);
// 	t.is(await authenticator.authenticate(context), context.res);
// 	t.deepEqual(context.req.auth, null);
// });
//
// test('Authenticator - return Response directly', async t => {
// 	const context = generateMockContext();
// 	const response = new Response;
// 	const authenticator = new Authenticator(() => response);
// 	t.is(authenticator.authHandler(context), response);
// 	t.is(await authenticator.authenticate(context), response);
// 	t.deepEqual(context.req.auth, null);
// });
