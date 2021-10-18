import test from 'ava';
import Res from './res';


test('foo', t => {
	const a = new Request('http://google.com')
	t.pass();
});


test('bar', t => {
	const a = new Request('http://google.com')
	t.pass();
});

// import * as nodeFetch from 'node-fetch';

// if (typeof fetch === 'undefined') {
// 	console.log('TRYING TO SET HEADERS GLOBALLY');
// 	expect.Headers = nodeFetch.Headers;
// }

// describe('MODULE: RES', () => {
// 	describe('Instantiate class', () => {
// 		const response = '11';
//
// 		it('should have a `status` property with a default value of 200', () => {
// 			expect(response).to.be.a('string');
// 			// expect(response).to.haveOwnProperty('status');
// 			// expect(response['status']).to.equal(200);
// 		});
//
// 		// it('should have a `body` property with a default value of `{}`', () => {
// 		// 	expect(response).toHaveProperty('body');
// 		// 	expect(response['body']).toEqual({});
// 		// });
// 		//
// 		// it('should have a `headers` property with a default value of ``', () => {
// 		// 	expect(response).toHaveProperty('header');
// 		// 	expect(response['headers']).toEqual({});
// 		// });
// 	});
// });

const a =
	'npm uninstall @babel/core @babel/preset-env @babel/preset-typescript @types/jest @types/node babel-jest jest node-fetch';

const config = `  "babel": {
    "presets": [
      "@babel/preset-env",
      "@babel/preset-typescript"
    ]
  },`;
