import test from 'ava';
import { Res } from '../Res';
import { Authenticator } from './index';
import type { AuthData, AuthHandler } from './types';

class TestAuthenticator extends Authenticator {
	constructor(authHandler: AuthHandler) {
		super(authHandler);
	}
	public getAuthHAndler(): AuthHandler { return this.authHandler; }
	public getAuthData(): AuthData { return this.authData; }
}

const context = { req: new Request(''), res: new Res() };

test('Authenticator - Properties', t => {
	const authHandler = () => null;
	const authenticator = new TestAuthenticator(authHandler);
	t.deepEqual(authenticator.getAuthHAndler(), authHandler);
	t.deepEqual(authenticator.getAuthData(), null);
});

test('Authenticator - Auth data', async t => {
	const authenticator = new TestAuthenticator(() => ({ some: 'data' }));
	await authenticator.authenticate(context);
	t.deepEqual(authenticator.getAuthData(), { some: 'data' });
});


test('Authenticator - Authenticate - no/null authHandler', async t => {
	const authenticator = new TestAuthenticator(() => null);
	const result = await authenticator.authenticate(context);
	t.true(result);
});

test('Authenticator - Authenticate - successful authentication', async t => {
	const authenticator = new TestAuthenticator(() => ({ any: 'data' }));
	const result = await authenticator.authenticate(context);
	t.true(result);
});
//
test('Authenticator - Authenticate - failed authentication', async t => {
	const authenticator = new TestAuthenticator(() => false);
	const result = await authenticator.authenticate(context);
	t.false(result);
});
//
test('Authenticator - Authenticate - Return Response directly', async t => {
	const mockResponse = new Response();
	const authenticator = new TestAuthenticator(() => mockResponse);
	const result = await authenticator.authenticate(context);
	t.is(result, mockResponse);
});
//
test('Authenticator - Authenticate - Return Res directly', async t => {
	const authenticator = new TestAuthenticator(() => new Res());
	const result = await authenticator.authenticate(context);
	t.deepEqual(result, new Response(null, { status: 204 }));
});
