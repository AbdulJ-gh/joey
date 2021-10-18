export default {
	require: [ 'esm', "./testUtils/testRuntimeGlobals.js" ],
	files: [ "src/**/*.test.*" ],
	typescript: {
		rewritePaths: { "src/": 'lib/' },
		compile: false
	},
	cache: false,
	timeout: '10s'
}

