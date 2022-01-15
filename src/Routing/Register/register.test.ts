import test from 'ava';
import { Router } from '../Router';
import { Register } from './register';

test('Register - Properties', t => {
	const register = new Register;
	t.assert(Object.hasOwnProperty.call(register, 'paths'));
	t.assert(Object.hasOwnProperty.call(register, 'routers'));
});

test('Register - getRegisteredName', t => {
	t.is(Register.getRegisteredName(''), '/');
	t.is(Register.getRegisteredName('/'), '/');
	t.is(Register.getRegisteredName('abc'), '/abc');
	t.is(Register.getRegisteredName('/abc'), '/abc');
	t.is(Register.getRegisteredName('abc/'), '/abc');
	t.is(Register.getRegisteredName('/abc/'), '/abc');
});

test('Register - getName', t => {
	const url = 'https://example.com';
	t.is(Register.getName(url + '', ''), '/');
	t.is(Register.getName(url + '/', ''), '/');
	t.is(Register.getName(url + '/abc', ''), '/abc');
	t.is(Register.getName(url + '/abc/', ''), '/abc');
	t.is(Register.getName(url + '/abc', '/a'), 'bc');
	t.is(Register.getName(url + '/abc', '/abc'), '/');
	t.is(Register.getName(url + '/abc/', '/abc'), '/');
	t.is(Register.getName(url + '/abc/xyz', '/abc'), '/xyz');
	t.is(Register.getName(url + '/abc/xyz', '/abc/xyz'), '/');
	t.pass();
});

test('Register - registerMethod', t => {
	const register = new Register;
	const router = new Router;
	const handler = () => new Response;
	register.registerMethod(router, 'GET', '/abc', handler, false);
	t.is(register.paths['/abc'].GET?.routerContext, router);
	t.is(register.paths['/abc'].GET?.handler, handler);
	t.is(register.paths['/abc'].GET?.authenticate, false);
});

test('Register - registerRouter', t => {
	const register = new Register;
	const router = new Router;
	register.registerRouter('abc', router);
	t.is(register.routers['/abc'], router);
});

test('Register - matchRoute', t => {
	const register = new Register;

	// Note: Same behaviour for paths and routers
	register.paths = {
		'/': {},
		'/abc': {},
		'/abc/xyz': {},
		'/abc/xyz/123': {},
		'/:id': {},
		'/abc/:id': {},
		'/:id/xyz': {},
		'/abc/:id/xyz/:name': {},
		'/abc/:id/xyz/:name/123': {},
		'/:id/:name/:something/:else': {}
	};

	// Note: route will never be an empty string or have a trailing / when using getName
	t.is(register.matchRoute('/'), '/');
	t.is(register.matchRoute('/abc'), '/abc');
	t.is(register.matchRoute('/abc/xyz'), '/abc/xyz');
	t.is(register.matchRoute('/abc/xyz/123'), '/abc/xyz/123');
	t.is(register.matchRoute('/ab'), '/:id');
	t.is(register.matchRoute('/abcd'), '/:id');
	t.is(register.matchRoute('/abc/wxyz'), '/abc/:id');
	t.is(register.matchRoute('/abc/yz'), '/abc/:id');
	t.is(register.matchRoute('/ab/xyz'), '/:id/xyz');
	t.is(register.matchRoute('/abcd/xyz'), '/:id/xyz');
	t.is(register.matchRoute('/abc/wxyz/xyz/someName'), '/abc/:id/xyz/:name');
	t.is(register.matchRoute('/abc/wxyz/xyz/someName/123'), '/abc/:id/xyz/:name/123');
	t.is(register.matchRoute('/ab/wxyz/xyzz/abc'), '/:id/:name/:something/:else');
	t.falsy(register.matchRoute('/ab/wxyz/xyzz/abc/ffs'));
});
