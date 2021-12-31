import test from 'ava';
import { Res } from '../Res';
import { Authenticator } from './index';
import type { AuthData, AuthHandler } from './types';

class TestAuthenticator extends Authenticator {
	constructor() { super(); }
	public getAuthHAndler(): AuthHandler { return this.authHandler; }
	public getAuthData(): AuthData { return this.authData; }
	public getHasOwnHandler(): boolean { return this.hasOwnHandler; }
}


test('Authenticator - Properties', t => {
	const authenticator = new TestAuthenticator();
	const mockContext = { req: new Request(''), res: new Res() };
	t.deepEqual(authenticator.getAuthHAndler()(mockContext), null);
	t.deepEqual(authenticator.getAuthData(), null);
	t.deepEqual(authenticator.getHasOwnHandler(), false);
});


test('Authenticator - Has own handler', t => {
	const authenticator = new TestAuthenticator();
	authenticator.setHandler(() => null);
	t.deepEqual(authenticator.getHasOwnHandler(), true);
});


test('Authenticator - Auth data', async t => {
	const authenticator = new TestAuthenticator();
	const mockContext = { req: new Request(''), res: new Res() };
	authenticator.setHandler(() => ({ some: 'data' }));
	await authenticator.authenticate(mockContext);
	t.deepEqual(authenticator.getAuthData(), { some: 'data' });
});


test('Authenticator - Auth Handler', t => {
	const authenticator = new TestAuthenticator();
	const mockAuthHandler = () => null;
	authenticator.setHandler(mockAuthHandler);
	t.is(authenticator.getAuthHAndler(), mockAuthHandler);
});

test('Authenticator - Authenticate - no/null authHandler', async t => {
	const authenticator = new TestAuthenticator();
	const mockContext = { req: new Request(''), res: new Res() };
	let result = await authenticator.authenticate(mockContext);
	t.true(result);

	authenticator.setHandler(() => null);
	result = await authenticator.authenticate(mockContext);
	t.true(result);
});

test('Authenticator - Authenticate - successful authentication', async t => {
	const authenticator = new TestAuthenticator();
	const mockContext = { req: new Request(''), res: new Res() };
	authenticator.setHandler(() => ({ any: 'data' }));
	const result = await authenticator.authenticate(mockContext);
	t.true(result);
});

test('Authenticator - Authenticate - failed authentication', async t => {
	const authenticator = new TestAuthenticator();
	const mockContext = { req: new Request(''), res: new Res() };
	authenticator.setHandler(() => false);
	const result = await authenticator.authenticate(mockContext);
	t.false(result);
});

test('Authenticator - Authenticate - Return Response directly', async t => {
	const authenticator = new TestAuthenticator();
	const mockContext = { req: new Request(''), res: new Res() };
	const mockResponse = new Response();
	authenticator.setHandler(() => mockResponse);
	const result = await authenticator.authenticate(mockContext);
	t.is(result, mockResponse);
});

test('Authenticator - Authenticate - Return Res directly', async t => {
	const authenticator = new TestAuthenticator();
	const mockContext = { req: new Request(''), res: new Res() };
	const mockRes = new Res();
	authenticator.setHandler(() => mockRes);
	const result = await authenticator.authenticate(mockContext);
	t.deepEqual(result, new Response(null, { status: 204 }));
});
