import test from 'ava';
import { generateMockRequest } from '../../../testUtils/generateMockRequest';
import { Authenticator, type AuthHandler } from '../Authenticator';
import { baseConfig, Config } from '../config';
import { Register } from '../Register';
import { Res } from '../Res';
import { handleError } from './helpers';
import { Router } from './router';

class TestRouter extends Router {
	constructor() { super(); }
	public getRegister(): Register { return this.register; }
	public getConfig(): Partial<Config> { return this.config; }
	public getAuthenticator(): Authenticator | null { return this.authenticator; }
	public resolve = (request: Request, reducer = '') =>
		this.resolveHandler(request, reducer);
}

function setup() {
	const router = new TestRouter();
	return {
		router,
		register: router.getRegister(),
		authenticator: router.getAuthenticator(),
		resolveHandler: router.resolve
	};
}

const mockConfig: Config = {
	...baseConfig,
	notFound: { status: 400, body: 'Mock not found' }
};

test('Router - Properties', t => {
	const { router, register, authenticator } = setup();
	const config = router.getConfig();
	t.truthy(register);
	t.deepEqual(register, new Register);
	t.deepEqual(authenticator, null);
	t.deepEqual(config, {});
});

test('Router - HTTP methods', t => {
	const { router, register } = setup();
	const handler = () => new Response;
	router.get('/abc', handler);
	t.is(register.paths['/abc'].GET?.handler, handler);
	t.is(register.paths['/abc'].GET?.routerContext, router);
	t.true(register.paths['/abc'].GET?.authenticate);
});

test('Router - HTTP methods - auth flag', t => {
	const { router, register } = setup();
	const handler = () => new Response;
	router.get('/abc', false, handler);
	t.is(register.paths['/abc'].GET?.handler, handler);
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
	const { router } = setup();
	const authHandler: AuthHandler = () => ({ auth: 'data' });
	router.auth(authHandler);
	const authenticator: Authenticator = router.getAuthenticator() as Authenticator;
	t.deepEqual(authenticator.authHandler, authHandler);
	t.deepEqual(authenticator.authData, null);

	const context = { req: new Request(''), res: new Res() };
	await authenticator.authenticate(context);
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
	const { router } = setup();
	const context = { req: new Request(''), res: new Res() };

	router.auth(() => ({ some: 'data' }));
	const authenticator: Authenticator = router.getAuthenticator() as Authenticator;
	t.deepEqual(authenticator.authHandler(context), { some: 'data' });

	const sub1 = setup();
	const sub2 = setup();
	sub2.router.auth(() => ({ something: 'else' }));

	router.route('/abc', sub1.router);
	router.route('/xyz', sub2.router);

	t.deepEqual((sub1.router.getAuthenticator() as Authenticator).authHandler(context), { some: 'data' });
	t.deepEqual((sub2.router.getAuthenticator() as Authenticator).authHandler(context), { something: 'else' });
});

test('Router - ResolveHandler - default handler', t => {
	const { router, resolveHandler } = setup();
	const context = { req: new Request(''), res: new Res() };
	const request = generateMockRequest();
	router.configure(mockConfig);
	const resolvedHandler = resolveHandler(request);

	t.deepEqual(resolvedHandler.handler(context), handleError(mockConfig.notFound));
	t.is(resolvedHandler.authenticate, false);
	t.is(resolvedHandler.routerContext, router);
});

test('Router - ResolveHandler - default handler w/router config', t => {
	const { router, resolveHandler } = setup();
	const request = generateMockRequest();
	const context = { req: request, res: new Res() };
	router.configure(mockConfig);
	router.auth(() => ({ some: 'data' }));
	const resolvedHandler = resolveHandler(request);

	t.deepEqual(resolvedHandler.handler(context), handleError(mockConfig.notFound));
	t.is(resolvedHandler.authenticate, true);
	t.is(resolvedHandler.routerContext, router);
});

test('Router - ResolveHandler - default handler w/parent router config', t => {
	const { router } = setup();
	const request = generateMockRequest();
	const context = { req: request, res: new Res() };
	router.configure(mockConfig);
	router.auth(() => ({ some: 'data' }));

	const sub = setup();
	sub.router.configure(mockConfig);
	let resolvedHandler = sub.resolveHandler(request);
	t.deepEqual(resolvedHandler.handler(context), handleError(mockConfig.notFound));
	t.is(resolvedHandler.authenticate, false);
	t.is(resolvedHandler.routerContext, sub.router);

	router.route('/abc', sub.router);
	resolvedHandler = sub.resolveHandler(request);

	t.deepEqual(resolvedHandler.handler(context), handleError(mockConfig.notFound));
	t.is(resolvedHandler.authenticate, true);
	t.is(resolvedHandler.routerContext, sub.router);
});

test('Router - ResolveHandler - resolve GET path', t => {
	const { router, resolveHandler } = setup();
	const mockHandler = () => new Response();
	router.get('/', mockHandler);

	const request = generateMockRequest();
	t.is(resolveHandler(request).handler, mockHandler);
});

test('Router - ResolveHandler - resolve POST path', t => {
	const { router, resolveHandler } = setup();
	const mockHandler = () => new Response();
	router.post('/abc', mockHandler);

	const request = generateMockRequest('/abc', 'POST');
	t.is(resolveHandler(request).handler, mockHandler);
});

test('Router - ResolveHandler - resolve PATCH path', t => {
	const { router, resolveHandler } = setup();
	const mockHandler = () => new Response();
	router.patch('', mockHandler);

	const request = generateMockRequest('/', 'PATCH');
	t.is(resolveHandler(request).handler, mockHandler);
});

test('Router - ResolveHandler - resolve DELETE path', t => {
	const { router, resolveHandler } = setup();
	const mockHandler = () => new Response();
	router.delete('abc/xyz', mockHandler);

	const request = generateMockRequest('/abc/xyz', 'DELETE');
	t.is(resolveHandler(request).handler, mockHandler);
});

test('Router - ResolveHandler - resolve PUT path', t => {
	const { router, resolveHandler } = setup();
	const mockHandler = () => new Response();
	router.put('/abc/xyz/sdfzxcdfsdfssdfasddasdas', mockHandler);

	const request = generateMockRequest('/abc/xyz/sdfzxcdfsdfssdfasddasdas?query=param', 'PUT');
	t.is(resolveHandler(request).handler, mockHandler);
});

test('Router - ResolveHandler - resolve OPTIONS path', t => {
	const { router, resolveHandler } = setup();
	const mockHandler = () => new Response();
	router.options('/abccccc', mockHandler);

	const request = generateMockRequest('/abccccc', 'OPTIONS');
	t.is(resolveHandler(request).handler, mockHandler);
});

test('Router - ResolveHandler - resolve base route router', t => {
	const { router, resolveHandler } = setup();
	const sub = setup();
	const mockHandler1 = () => new Response();
	const mockHandler2 = () => new Response();

	sub.router.get('', mockHandler1);
	sub.router.get('/xyz', mockHandler2);
	router.route('', sub.router);

	let request = generateMockRequest('');
	t.is(resolveHandler(request).handler, mockHandler1);
	request = generateMockRequest('/xyz');
	t.is(resolveHandler(request).handler, mockHandler2);
});

test('Router - ResolveHandler - resolve base route (/) router', t => {
	const { router, resolveHandler } = setup();
	const sub = setup();
	const mockHandler1 = () => new Response();
	const mockHandler2 = () => new Response();

	sub.router.get('', mockHandler1);
	sub.router.get('/xyz', mockHandler2);
	router.route('/', sub.router);

	let request = generateMockRequest('');
	t.is(resolveHandler(request).handler, mockHandler1);
	request = generateMockRequest('/xyz');
	t.is(resolveHandler(request).handler, mockHandler2);
});

test('Router - ResolveHandler - resolve router', t => {
	const { router, resolveHandler } = setup();
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

	let request = generateMockRequest('/abc');
	t.is(resolveHandler(request).handler, mockHandler1);
	t.is(resolveHandler(request).routerContext, sub.router);
	request = generateMockRequest('/abc/xyz');
	t.is(resolveHandler(request).handler, mockHandler2);
	request = generateMockRequest('/abc/xyz/lmnop');
	t.is(resolveHandler(request).handler, mockHandler3);
	request = generateMockRequest('/abc/xyz/lmnop/dsfdsfd/dfgdfghdfh/erases/fhfh/werewr');
	t.is(resolveHandler(request).handler, mockHandler4);
});

test('Router - ResolveHandler - resolve doubly nested base route router', t => {
	const { router, resolveHandler } = setup();

	const sub1 = setup();
	const sub2 = setup();

	const mockHandler1 = () => new Response();
	const mockHandler2 = () => new Response();

	sub1.router.get('/abc', mockHandler1);
	sub2.router.get('/xyz', mockHandler2);

	router.route('/AA', sub1.router);
	sub1.router.route('/', sub2.router);

	let request = generateMockRequest('/AA/abc');
	t.is(resolveHandler(request).handler, mockHandler1);
	t.is(resolveHandler(request).routerContext, sub1.router);
	request = generateMockRequest('/AA/xyz');
	t.is(resolveHandler(request).handler, mockHandler2);
});

test('Router - ResolveHandler - resolve path before router/routed path', t => {
	const { router, resolveHandler } = setup();
	const mockHandler = () => new Response();
	router.get('/abc/xyz', mockHandler);

	const sub = setup();
	const subMockHandler1 = () => new Response();
	const subMockHandler2 = () => new Response();
	sub.router.get('/xyz', subMockHandler1);
	sub.router.get('/abc', subMockHandler2);

	router.route('/abc', sub.router);

	let request = generateMockRequest('/abc/xyz');
	t.is(resolveHandler(request).handler, mockHandler);

	request = generateMockRequest('/abc/abc');
	t.is(resolveHandler(request).handler, subMockHandler2);
});

test('Router - ResolveHandler - method not allowed', t => {
	const { router, resolveHandler } = setup();
	const request = generateMockRequest('/abc', 'POST');
	const context = { req: request, res: new Res() };
	const mockHandler = () => new Response();
	router.get('/abc', mockHandler);
	router.configure(mockConfig);

	const response = resolveHandler(request).handler(context) as Response;
	const expectedResponse = handleError(baseConfig.methodNotAllowed);
	expectedResponse.headers.set('Allow', 'GET');
	t.deepEqual(response, expectedResponse);
});

test('Router - ResolveHandler - method not allowed, no emit allow', t => {
	const { router, resolveHandler } = setup();
	const request = generateMockRequest('/abc', 'POST');
	const context = { req: request, res: new Res() };
	const mockHandler = () => new Response();
	router.get('/abc', mockHandler);
	router.configure({ ...mockConfig, emitAllowHeader: false });

	const response = resolveHandler(request).handler(context) as Response;
	const expectedResponse = handleError(baseConfig.methodNotAllowed);
	t.deepEqual(response, expectedResponse);
});
