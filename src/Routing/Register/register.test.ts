import test from 'ava';
import { Router } from '../Router';
import { Register } from './register';

const register = new Register;
const router = new Router;

test('Register - Properties', t => {
	t.assert(Object.hasOwnProperty.call(register, 'paths'));
	t.assert(Object.hasOwnProperty.call(register, 'routers'));
});

test('Register - getRegisteredName', t => {
	t.is(Register.getRegisteredName(''), '__base_route');
	t.is(Register.getRegisteredName('/'), '__base_route');
	t.is(Register.getRegisteredName('abc'), '/abc');
	t.is(Register.getRegisteredName('/abc'), '/abc');
	t.is(Register.getRegisteredName('abc/'), '/abc');
	t.is(Register.getRegisteredName('/abc/'), '/abc');
});


test('Register - registerMethod', t => {
	const handler = () => new Response;
	register.registerMethod(router, 'GET', '/abc', handler, false);
	t.is(register.paths['/abc'].GET?.routerContext, router);
	t.is(register.paths['/abc'].GET?.handler, handler);
	t.is(register.paths['/abc'].GET?.authenticate, false);
});

test('Register - registerRouter', t => {
	register.registerRouter('abc', router);
	t.is(register.routers['/abc'], router);
});
