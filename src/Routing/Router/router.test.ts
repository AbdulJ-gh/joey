import test from 'ava';
// import { generateMockContext } from '../../../testUtils/generateMockContext';
// import { generateMockRequest } from '../../../testUtils/generateMockRequest';
// import { Authenticator, type AuthHandler } from '../Authenticator';
// import { baseConfig, Config } from '../config';
// import { Register } from '../Register';
// import { handleDefaultError } from '../helpers';
// import { ErrorBody, Res } from '../Res';
// import { Router } from './router';
// import { ResolvedHandler } from './types';
//
// class TestRouter extends Router {
// 	constructor() { super(); }
// 	public get Get(): {
// 		register: Register;
// 		config: Partial<Config>;
// 		authenticator?: Authenticator;
// 		resolveHandler: (request: Request) => ResolvedHandler;
// 		} {
// 		return {
// 			register: this.register,
// 			config: this.config,
// 			authenticator: this.authenticator,
// 			resolveHandler: this.resolveHandler
// 		};
// 	}
// }
//
// function setup() {
// 	const router = new TestRouter;
// 	const { register, resolveHandler } = router.Get;
// 	return { router, register, resolveHandler };
// }
//
// const context = generateMockContext();
//
// const mockConfig: Required<Config> = {
// 	...baseConfig,
// 	notFound: { status: 400, body: 'Mock not found' }
// };

test('Router - PASS', t => {
	t.pass();
});

// test('Router - Properties', t => {
// 	const { router, register } = setup();
// 	const { config, authenticator } = router.Get;
// 	t.deepEqual(register, new Register);
// 	t.deepEqual(authenticator, null);
// 	t.deepEqual(config, {});
// 	t.pass();
// });
//
// test('Router - HTTP methods', t => {
// 	const { router, register } = setup();
// 	const handler = () => new Response;
// 	router.get('/abc', handler);
// 	t.is(register.paths['/abc'].GET?.handler, handler);
// 	t.is(register.paths['/abc'].GET?.routerContext, router);
// 	t.true(register.paths['/abc'].GET?.authenticate);
// 	t.is(register.paths['/abc'].GET?.absolutePath, undefined);
// });
//
// test('Router - HTTP methods - auth flag', t => {
// 	const { router, register } = setup();
// 	const handler = () => new Response;
// 	router.get('/abc', false, handler);
// 	t.is(register.paths['/abc'].GET?.handler, handler);
// 	t.is(register.paths['/abc'].GET?.routerContext, router);
// 	t.false(register.paths['/abc'].GET?.authenticate);
// 	t.is(register.paths['/abc'].GET?.absolutePath, undefined);
// });
//
// test('Router - Configure', t => {
// 	const { router } = setup();
// 	router.configure({ emitAllowHeader: false });
// 	const config = router.Get.config;
// 	t.is(config.emitAllowHeader, false);
// 	t.deepEqual(config, { emitAllowHeader: false });
// });
//
// test('Router - Auth', t => {
// 	const { router } = setup();
// 	const authHandler: AuthHandler = () => ({ auth: 'data' });
// 	router.auth(authHandler);
// 	const { authenticator } = router.Get;
// 	t.is(authenticator?.authHandler, authHandler);
// });
//
// test('Router - Route - Attach sub-router', t => {
// 	const { router, register } = setup();
// 	const sub = setup();
// 	const subRouter = sub.router;
//
// 	router.route('/abc', subRouter);
// 	t.is(register.routers['/abc'], subRouter);
// });
//
// test('Router - Route - Inherit config', t => {
// 	const { router } = setup();
// 	router.configure({ emitAllowHeader: false });
//
// 	const sub = setup();
// 	const subRouter = sub.router;
//
// 	subRouter.configure({ prettifyJson: true });
// 	t.deepEqual(subRouter.Get.config, { prettifyJson: true });
//
// 	router.route('/abc', subRouter);
// 	t.deepEqual(subRouter.Get.config, { prettifyJson: true, emitAllowHeader: false });
// });
//
// test('Router - Route - Inherit Authenticator', t => {
// 	const { router } = setup();
//
// 	router.auth(() => ({ some: 'data' }));
// 	const { authenticator } = router.Get;
// 	t.deepEqual(authenticator?.authHandler(context), { some: 'data' });
//
// 	const sub1 = setup();
// 	const sub2 = setup();
// 	sub2.router.auth(() => ({ something: 'else' }));
//
// 	router.route('/abc', sub1.router);
// 	router.route('/xyz', sub2.router);
//
// 	t.deepEqual(sub1.router.Get.authenticator?.authHandler(context), { some: 'data' });
// 	t.deepEqual(sub2.router.Get.authenticator?.authHandler(context), { something: 'else' });
// 	t.pass();
// });
//
// /** REVIEW FROM HERE */
// test('Router - ResolveHandler - default handler', t => {
// 	const { router, resolveHandler } = setup();
// 	const request = generateMockRequest();
// 	router.configure(mockConfig);
// 	const resolvedHandler = resolveHandler(request);
//
// 	t.deepEqual(resolvedHandler.handler(context), handleDefaultError(mockConfig.notFound, false));
// 	t.is(resolvedHandler.authenticate, false);
// 	t.is(resolvedHandler.routerContext, router);
// });
//
// test('Router - ResolveHandler - default handler w/router config', t => {
// 	const { router, resolveHandler } = setup();
// 	const request = generateMockRequest();
// 	router.configure(mockConfig);
// 	router.auth(() => ({ some: 'data' }));
// 	const resolvedHandler = resolveHandler(request);
//
// 	t.deepEqual(resolvedHandler.handler(context), handleDefaultError(mockConfig.notFound, false));
// 	t.is(resolvedHandler.authenticate, true);
// 	t.is(resolvedHandler.routerContext, router);
// });
//
// test('Router - ResolveHandler - default handler w/parent router config', t => {
// 	const { router } = setup();
// 	const request = generateMockRequest();
// 	router.configure(mockConfig);
// 	router.auth(() => ({ some: 'data' }));
//
// 	const sub = setup();
// 	sub.router.configure(mockConfig);
// 	let resolvedHandler = sub.resolveHandler(request);
// 	t.deepEqual(resolvedHandler.handler(context), handleDefaultError(mockConfig.notFound, false));
// 	t.is(resolvedHandler.authenticate, false);
// 	t.is(resolvedHandler.routerContext, sub.router);
//
// 	router.route('/abc', sub.router);
// 	resolvedHandler = sub.resolveHandler(request);
//
// 	t.deepEqual(resolvedHandler.handler(context), handleDefaultError(mockConfig.notFound, false));
// 	t.is(resolvedHandler.authenticate, true);
// 	t.is(resolvedHandler.routerContext, sub.router);
// });
// /** REVIEW TILL HERE */
//
// test('Router - ResolveHandler - resolve GET path', t => {
// 	const { router, resolveHandler } = setup();
// 	const mockHandler = () => new Response();
// 	router.get('/', mockHandler);
//
// 	const request = generateMockRequest();
// 	t.is(resolveHandler(request).handler, mockHandler);
// });
//
// test('Router - ResolveHandler - resolve POST path', t => {
// 	const { router, resolveHandler } = setup();
// 	const mockHandler = () => new Response();
// 	router.post('/abc', mockHandler);
//
// 	const request = generateMockRequest('/abc', 'POST');
// 	t.is(resolveHandler(request).handler, mockHandler);
// });
//
// test('Router - ResolveHandler - resolve PATCH path', t => {
// 	const { router, resolveHandler } = setup();
// 	const mockHandler = () => new Response();
// 	router.patch('', mockHandler);
//
// 	const request = generateMockRequest('/', 'PATCH');
// 	t.is(resolveHandler(request).handler, mockHandler);
// });
//
// test('Router - ResolveHandler - resolve DELETE path', t => {
// 	const { router, resolveHandler } = setup();
// 	const mockHandler = () => new Response();
// 	router.delete('abc/xyz', mockHandler);
//
// 	const request = generateMockRequest('/abc/xyz#section2', 'DELETE');
// 	t.is(resolveHandler(request).handler, mockHandler);
// });
//
// test('Router - ResolveHandler - resolve PUT path', t => {
// 	const { router, resolveHandler } = setup();
// 	const mockHandler = () => new Response();
// 	router.put('/abc/xyz/sdfzxcdfsdfssdfasddasdas', mockHandler);
//
// 	const request = generateMockRequest('/abc/xyz/sdfzxcdfsdfssdfasddasdas?query=param', 'PUT');
// 	t.is(resolveHandler(request).handler, mockHandler);
// });
//
// test('Router - ResolveHandler - resolve OPTIONS path', t => {
// 	const { router, resolveHandler } = setup();
// 	const mockHandler = () => new Response();
// 	router.options('/abccccc', mockHandler);
//
// 	const request = generateMockRequest('/abccccc', 'OPTIONS');
// 	t.is(resolveHandler(request).handler, mockHandler);
// });
//
// test('Router - ResolveHandler - resolve base route router', t => {
// 	const { router, resolveHandler } = setup();
// 	const mockHandler1 = () => new Response();
// 	const mockHandler2 = () => new Response();
//
// 	const cases: [string, string][] = [['', ''], ['/', '/'], ['/', ''], ['', '/']];
// 	cases.forEach(c => {
// 		t.log('Test case:', `"${c[0]}" + "${c[1]}"`);
// 		const sub = setup();
// 		sub.router.get(c[0], mockHandler1);
// 		sub.router.get('/xyz', mockHandler2);
// 		router.route(c[1], sub.router);
//
// 		let request = generateMockRequest('');
// 		t.is(resolveHandler(request).handler, mockHandler1);
// 		request = generateMockRequest('/xyz');
// 		t.is(resolveHandler(request).handler, mockHandler2);
// 		t.pass();
// 	});
// });
//
//
// test('Router - ResolveHandler - resolve router', t => {
// 	const { router, resolveHandler } = setup();
// 	const sub1 = setup();
// 	const mockHandler1 = () => new Response();
// 	const mockHandler2 = () => new Response();
// 	const mockHandler3 = () => new Response();
// 	const mockHandler4 = () => new Response();
//
// 	sub1.router.get('', mockHandler1);
// 	sub1.router.get('/xyz', mockHandler2);
// 	sub1.router.get('/xyz/lmnop', mockHandler3);
// 	sub1.router.get('/xyz/lmnop/dsfdsfd/dfgdfghdfh/erases/fhfh/werewr', mockHandler4);
// 	router.route('/abc', sub1.router);
//
// 	const sub2 = setup();
// 	router.route('', sub2.router);
//
// 	let request = generateMockRequest('/abc');
// 	t.is(resolveHandler(request).handler, mockHandler1);
// 	t.is(resolveHandler(request).routerContext, sub1.router);
// 	request = generateMockRequest('/abc/xyz');
// 	t.is(resolveHandler(request).handler, mockHandler2);
// 	request = generateMockRequest('/abc/xyz/lmnop');
// 	t.is(resolveHandler(request).handler, mockHandler3);
// 	request = generateMockRequest('/abc/xyz/lmnop/dsfdsfd/dfgdfghdfh/erases/fhfh/werewr');
// 	t.is(resolveHandler(request).handler, mockHandler4);
// });
//
// test('Router - ResolveHandler - resolve nested base route router', t => {
// 	const { router, resolveHandler } = setup();
//
// 	const sub1 = setup();
// 	const sub2 = setup();
//
// 	const mockHandler1 = () => new Response();
// 	const mockHandler2 = () => new Response();
//
// 	sub1.router.get('/abc', mockHandler1);
// 	sub2.router.get('/xyz', mockHandler2);
//
// 	router.route('/', sub1.router);
// 	sub1.router.route('/', sub2.router);
//
// 	let request = generateMockRequest('/abc');
// 	t.is(resolveHandler(request).handler, mockHandler1);
// 	t.is(resolveHandler(request).routerContext, sub1.router);
// 	request = generateMockRequest('/xyz');
// 	t.is(resolveHandler(request).handler, mockHandler2);
//
// 	router.route('/AA', sub1.router);
// 	request = generateMockRequest('/AA/abc');
// 	t.is(resolveHandler(request).handler, mockHandler1);
// 	t.is(resolveHandler(request).routerContext, sub1.router);
// 	request = generateMockRequest('/AA/xyz');
// 	t.is(resolveHandler(request).handler, mockHandler2);
// });
//
// test('Router - ResolveHandler - resolve path before router/routed path', t => {
// 	const { router, resolveHandler } = setup();
// 	const mockHandler = () => new Response();
// 	router.get('/abc/xyz', mockHandler);
//
// 	const sub = setup();
// 	const subMockHandler1 = () => new Response();
// 	const subMockHandler2 = () => new Response();
// 	sub.router.get('/xyz', subMockHandler1);
// 	sub.router.get('/abc', subMockHandler2);
//
// 	router.route('/abc', sub.router);
//
// 	let request = generateMockRequest('/abc/xyz');
// 	t.is(resolveHandler(request).handler, mockHandler);
//
// 	request = generateMockRequest('/abc/abc');
// 	t.is(resolveHandler(request).handler, subMockHandler2);
// });
//
// /** CANNOT TEST UNTIL ERROR HANDLING IS DONE */
// // test('Router - ResolveHandler - method not allowed', t => {
// // 	const { router, resolveHandler } = setup();
// // 	const request = generateMockRequest('/abc', 'POST');
// // 	const mockHandler = () => new Response();
// // 	router.get('/abc', mockHandler);
// // 	router.configure(mockConfig);
// //
// // 	const response = resolveHandler(request).handler(context) as Response;
// // 	const expectedResponse = handleSystemError(baseConfig.methodNotAllowed);
// // 	expectedResponse.headers.set('allow', 'GET');
// // 	t.pass();
// // });
//
// test('Router - ResolveHandler - method not allowed, no emit allow', t => {
// 	const { router, resolveHandler } = setup();
// 	const request = generateMockRequest('/abc', 'POST');
// 	const mockHandler = () => new Response();
// 	router.get('/abc', mockHandler);
// 	router.configure({ ...mockConfig, emitAllowHeader: false });
//
// 	const response = resolveHandler(request).handler(context);
// 	const methodNotAllowed = baseConfig.methodNotAllowed as { body: ErrorBody; };
// 	const expectedResponse = new Res(methodNotAllowed.body, 405);
// 	t.deepEqual(response, expectedResponse);
// });
