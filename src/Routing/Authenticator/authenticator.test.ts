import test from 'ava';
import { generateMockContext } from '../../../testUtils/generateMockContext';
import { Authenticator } from './index';


test('Authenticator - setHandler', t => {
	const authHandler = () => null;
	const authenticator = new Authenticator;
	authenticator.setHandler(authHandler);
	t.is(authenticator.authHandler, authHandler);
});

test('Authenticator - Handler returns data', async t => {
	const context = generateMockContext();
	const authenticator = new Authenticator;
	authenticator.setHandler(() => ({ some: 'data' }));
	t.deepEqual(authenticator.authHandler(context), { some: 'data' });
	t.true(await authenticator.authenticate(context));
	t.deepEqual(context.req.auth, { some: 'data' });
});

test('Authenticator - Handler returns null', async t => {
	const context = generateMockContext();
	const authenticator = new Authenticator;
	authenticator.setHandler(() => null);
	t.deepEqual(authenticator.authHandler(context), null);
	t.true(await authenticator.authenticate(context));
	t.is(context.req.auth, null);
});

test('Authenticator - Handler returns true', async t => {
	const context = generateMockContext();
	const authenticator = new Authenticator;
	authenticator.setHandler(() => true);
	t.true(authenticator.authHandler(context));
	t.true(await authenticator.authenticate(context));
	t.deepEqual(context.req.auth, null);
});

test('Authenticator - Handler returns false', async t => {
	const context = generateMockContext();
	const authenticator = new Authenticator;
	authenticator.setHandler(() => false);
	t.false(authenticator.authHandler(context));
	t.false(await authenticator.authenticate(context));
	t.deepEqual(context.req.auth, null);
});

test('Authenticator - return Res directly', async t => {
	const context = generateMockContext();
	const authenticator = new Authenticator;
	authenticator.setHandler(({ res }) => res);
	t.is(authenticator.authHandler(context), context.res);
	t.is(await authenticator.authenticate(context), context.res);
	t.deepEqual(context.req.auth, null);
});

test('Authenticator - return Response directly', async t => {
	const context = generateMockContext();
	const response = new Response;
	const authenticator = new Authenticator;
	authenticator.setHandler(() => response);
	t.is(authenticator.authHandler(context), response);
	t.is(await authenticator.authenticate(context), response);
	t.deepEqual(context.req.auth, null);
});
