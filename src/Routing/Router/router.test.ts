import test from 'ava';
import { generateMockRequest } from '../../../testUtils/generateMockRequest';
import { Authenticator } from '../Authenticator';
import { baseConfig, Config } from '../config';
import { Register } from '../Register';
import { Res } from '../Res';
import { handleError } from './helpers';
import { Router } from './router';
import type { AuthHandler } from '../Authenticator';

class TestRouter extends Router {
	constructor() { super(); }
	public getRegister(): Register { return this.register; }
	public getConfig(): Partial<Config> { return this.config; }
	public getAuthenticator(): Authenticator { return this.authenticator; }
}

function setup() {
	const router = new TestRouter();
	return {
		router,
		register: router.getRegister(),
		authenticator: router.getAuthenticator(),
		resolver: router['resolveHandler']
	};
}

const mockConfig: Config = {
	...baseConfig,
	notFound: { status: 400, body: 'Mock not found' }
};

test('Router - Properties', t => {
	const { router, register, authenticator } = setup();
	const config = router.getConfig();
	const mockContext = { req: new Request(''), res: new Res() };
	t.truthy(register);
	t.deepEqual(register, new Register);
	t.deepEqual(authenticator.authData, new Authenticator().authData);
	t.deepEqual(authenticator.authHandler(mockContext), new Authenticator().authHandler(mockContext));
	t.deepEqual(config, {});
});

test('Router - HTTP methods', t => {
	const { router, register } = setup();
	const mockHandler = () => new Response;
	router.get('/abc', mockHandler);
	t.is(register.paths['/abc'].GET?.handler, mockHandler);
	t.is(register.paths['/abc'].GET?.routerContext, router);
	t.true(register.paths['/abc'].GET?.authenticate);
});

test('Router - HTTP methods - auth flag', t => {
	const { router, register } = setup();
	const mockHandler = () => new Response;
	router.get('/abc', false, mockHandler);
	t.is(register.paths['/abc'].GET?.handler, mockHandler);
	t.is(register.paths['/abc'].GET?.routerContext, router);
	t.false(register.paths['/abc'].GET?.authenticate);
});

test('Router - Configure', t => {
	const { router } = setup();
	router.configure({ emitAllowHeader: false });
	const config = router.getConfig();
	t.is(config.emitAllowHeader, false);
	t.deepEqual(config, { emitAllowHeader: false });
});

test('Router - Auth', async t => {
	const { router, authenticator } = setup();
	const authHandler: AuthHandler = () => ({ auth: 'data' });
	router.auth(authHandler);
	t.deepEqual(authenticator.authHandler, authHandler);
	t.deepEqual(authenticator.hasOwnHandler, true);
	t.deepEqual(authenticator.authData, null);

	const mockContext = { req: new Request(''), res: new Res() };
	await authenticator.authenticate(mockContext);
	t.deepEqual(authenticator.authData, { auth: 'data' });
});

test('Router - Route - Attach sub-router', t => {
	const { router, register } = setup();
	const sub = setup();
	const subRouter = sub.router;

	router.route('/abc', subRouter);
	t.is(register.routers['/abc'], subRouter);
});

test('Router - Route - Inherit config', t => {
	const { router } = setup();
	router.configure({ emitAllowHeader: false });

	const sub = setup();
	const subRouter = sub.router;

	subRouter.configure({ status: 400 });
	t.deepEqual(subRouter.getConfig(), { status: 400 });

	router.route('/abc', subRouter);
	t.deepEqual(subRouter.getConfig(), { status: 400, emitAllowHeader: false });
});

test('Router - Route - Inherit Authenticator', t => {
	const { router, authenticator } = setup();
	const mockContext = { req: new Request(''), res: new Res() };

	router.auth(() => ({ some: 'data' }));
	t.deepEqual(authenticator.authHandler(mockContext), { some: 'data' });

	const sub1 = setup();
	const sub2 = setup();
	sub2.router.auth(() => ({ something: 'else' }));

	router.route('/abc', sub1.router);
	router.route('/xyz', sub2.router);

	t.deepEqual(sub1.router.getAuthenticator().authHandler(mockContext), { some: 'data' });
	t.deepEqual(sub2.router.getAuthenticator().authHandler(mockContext), { something: 'else' });
	t.is(sub1.router.getAuthenticator().hasOwnHandler, true);
	t.is(sub2.router.getAuthenticator().hasOwnHandler, true);
});

test('Router - ResolveHandler - default handler', t => {
	const { router, resolver } = setup();
	const mockContext = { req: new Request(''), res: new Res() };
	const mockRequest = generateMockRequest();
	router.configure(mockConfig);

	t.deepEqual(resolver(mockRequest, router).handler(mockContext), handleError(mockConfig.notFound));
	t.is(resolver(mockRequest, router).authenticate, false);
	t.is(resolver(mockRequest, router).routerContext, router);
});

test('Router - ResolveHandler - default handler w/router config', t => {
	const { router, resolver } = setup();
	const mockRequest = generateMockRequest();
	const mockContext = { req: mockRequest, res: new Res() };
	router.configure(mockConfig);
	router.auth(() => ({ some: 'data' }));

	t.deepEqual(resolver(mockRequest, router).handler(mockContext), handleError(mockConfig.notFound));
	t.is(resolver(mockRequest, router).authenticate, true);
	t.is(resolver(mockRequest, router).routerContext, router);
});

test('Router - ResolveHandler - default handler w/parent router config', t => {
	const { router } = setup();
	const mockRequest = generateMockRequest();
	const mockContext = { req: mockRequest, res: new Res() };
	router.auth(() => ({ some: 'data' }));

	const sub = setup();
	sub.router.configure(mockConfig);
	t.deepEqual(sub.resolver(mockRequest, sub.router).handler(mockContext), handleError(mockConfig.notFound));
	t.is(sub.resolver(mockRequest, sub.router).authenticate, false);
	t.is(sub.resolver(mockRequest, sub.router).routerContext, sub.router);

	router.route('/abc', sub.router);
	t.deepEqual(sub.resolver(mockRequest, sub.router)
		.handler(mockContext), handleError(mockConfig.notFound)
	);
	t.is(sub.resolver(mockRequest, sub.router).authenticate, true);
	t.is(sub.resolver(mockRequest, sub.router).routerContext, sub.router);
});

test('Router - ResolveHandler - resolve GET path', t => {
	const { router, resolver } = setup();
	const mockHandler = () => new Response();
	router.get('/', mockHandler);

	const mockRequest = generateMockRequest();
	t.is(resolver(mockRequest, router).handler, mockHandler);
});

test('Router - ResolveHandler - resolve POST path', t => {
	const { router, resolver } = setup();
	const mockHandler = () => new Response();
	router.post('/abc', mockHandler);

	const mockRequest = generateMockRequest('/abc', 'POST');
	t.is(resolver(mockRequest, router).handler, mockHandler);
});

test('Router - ResolveHandler - resolve PATCH path', t => {
	const { router, resolver } = setup();
	const mockHandler = () => new Response();
	router.patch('', mockHandler);

	const mockRequest = generateMockRequest('/', 'PATCH');
	t.is(resolver(mockRequest, router).handler, mockHandler);
});

test('Router - ResolveHandler - resolve DELETE path', t => {
	const { router, resolver } = setup();
	const mockHandler = () => new Response();
	router.delete('abc/xyz', mockHandler);

	const mockRequest = generateMockRequest('/abc/xyz', 'DELETE');
	t.is(resolver(mockRequest, router).handler, mockHandler);
});

test('Router - ResolveHandler - resolve PUT path', t => {
	const { router, resolver } = setup();
	const mockHandler = () => new Response();
	router.put('/abc/xyz/sdfzxcdfsdfssdfasddasdas', mockHandler);

	const mockRequest = generateMockRequest('/abc/xyz/sdfzxcdfsdfssdfasddasdas?query=param', 'PUT');
	t.is(resolver(mockRequest, router).handler, mockHandler);
});

test('Router - ResolveHandler - resolve OPTIONS path', t => {
	const { router, resolver } = setup();
	const mockHandler = () => new Response();
	router.options('/abccccc', mockHandler);

	const mockRequest = generateMockRequest('/abccccc', 'OPTIONS');
	t.is(resolver(mockRequest, router).handler, mockHandler);
});

test('Router - ResolveHandler - resolve base route router', t => {
	const { router, resolver } = setup();
	const sub = setup();
	const mockHandler1 = () => new Response();
	const mockHandler2 = () => new Response();

	sub.router.get('', mockHandler1);
	sub.router.get('/xyz', mockHandler2);
	router.route('', sub.router);

	let mockRequest = generateMockRequest('');
	t.is(resolver(mockRequest, router).handler, mockHandler1);
	mockRequest = generateMockRequest('/xyz');
	t.is(resolver(mockRequest, router).handler, mockHandler2);
});

test('Router - ResolveHandler - resolve base route (/) router', t => {
	const { router, resolver } = setup();
	const sub = setup();
	const mockHandler1 = () => new Response();
	const mockHandler2 = () => new Response();

	sub.router.get('', mockHandler1);
	sub.router.get('/xyz', mockHandler2);
	router.route('/', sub.router);

	let mockRequest = generateMockRequest('');
	t.is(resolver(mockRequest, router).handler, mockHandler1);
	mockRequest = generateMockRequest('/xyz');
	t.is(resolver(mockRequest, router).handler, mockHandler2);
});

test('Router - ResolveHandler - resolve router', t => {
	const { router, resolver } = setup();
	const sub = setup();
	const mockHandler1 = () => new Response();
	const mockHandler2 = () => new Response();
	const mockHandler3 = () => new Response();
	const mockHandler4 = () => new Response();

	sub.router.get('', mockHandler1);
	sub.router.get('/xyz', mockHandler2);
	sub.router.get('/xyz/lmnop', mockHandler3);
	sub.router.get('/xyz/lmnop/dsfdsfd/dfgdfghdfh/erases/fhfh/werewr', mockHandler4);
	router.route('/abc', sub.router);

	const sub2 = setup();
	router.route('', sub2.router);

	let mockRequest = generateMockRequest('/abc');
	t.is(resolver(mockRequest, router).handler, mockHandler1);
	t.is(resolver(mockRequest, router).routerContext, sub.router);
	mockRequest = generateMockRequest('/abc/xyz');
	t.is(resolver(mockRequest, router).handler, mockHandler2);
	mockRequest = generateMockRequest('/abc/xyz/lmnop');
	t.is(resolver(mockRequest, router).handler, mockHandler3);
	mockRequest = generateMockRequest('/abc/xyz/lmnop/dsfdsfd/dfgdfghdfh/erases/fhfh/werewr');
	t.is(resolver(mockRequest, router).handler, mockHandler4);
});

test('Router - ResolveHandler - resolve doubly nested base route router', t => {
	const { router, resolver } = setup();

	const sub1 = setup();
	const sub2 = setup();

	const mockHandler1 = () => new Response();
	const mockHandler2 = () => new Response();

	sub1.router.get('/abc', mockHandler1);
	sub2.router.get('/xyz', mockHandler2);

	router.route('/AA', sub1.router);
	sub1.router.route('/', sub2.router);

	let mockRequest = generateMockRequest('/AA/abc');
	t.is(resolver(mockRequest, router).handler, mockHandler1);
	t.is(resolver(mockRequest, router).routerContext, sub1.router);
	mockRequest = generateMockRequest('/AA/xyz');
	t.is(resolver(mockRequest, router).handler, mockHandler2);
});

test('Router - ResolveHandler - resolve path before router/routed path', t => {
	const { router, resolver } = setup();
	const mockHandler = () => new Response();
	router.get('/abc/xyz', mockHandler);

	const sub = setup();
	const subMockHandler1 = () => new Response();
	const subMockHandler2 = () => new Response();
	sub.router.get('/xyz', subMockHandler1);
	sub.router.get('/abc', subMockHandler2);

	router.route('/abc', sub.router);

	let mockRequest = generateMockRequest('/abc/xyz');
	t.is(resolver(mockRequest, router).handler, mockHandler);

	mockRequest = generateMockRequest('/abc/abc');
	t.is(resolver(mockRequest, router).handler, subMockHandler2);
});

test('Router - ResolveHandler - method not allowed', t => {
	const { router, resolver } = setup();
	const mockRequest = generateMockRequest('/abc', 'POST');
	const mockContext = { req: mockRequest, res: new Res() };
	const mockHandler = () => new Response();
	router.get('/abc', mockHandler);
	router.configure(mockConfig);

	const response = resolver(mockRequest, router).handler(mockContext) as Response;
	const expectedResponse = handleError(baseConfig.methodNotAllowed);
	expectedResponse.headers.set('Allow', 'GET');
	t.deepEqual(response, expectedResponse);
});

test('Router - ResolveHandler - method not allowed, no emit allow', t => {
	const { router, resolver } = setup();
	const mockRequest = generateMockRequest('/abc', 'POST');
	const mockContext = { req: mockRequest, res: new Res() };
	const mockHandler = () => new Response();
	router.get('/abc', mockHandler);
	router.configure({ ...mockConfig, emitAllowHeader: false });

	const response = resolver(mockRequest, router).handler(mockContext) as Response;
	const expectedResponse = handleError(baseConfig.methodNotAllowed);
	t.deepEqual(response, expectedResponse);
});


/**
 * Not tested yet
 * logger
 * private matchRoute
 * private getName
 * */
