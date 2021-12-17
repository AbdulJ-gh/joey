export default {
	require: ['esm', './testUtils/testRuntimeGlobals.js'],
	files: ['src/**/*.test.*'],
	typescript: {
		rewritePaths: { 'src/': 'lib-test/src/' },
		compile: 'tsc'
	},
	verbose: true,
	cache: false,
	timeout: '10s',
	ignoredByWatcher: ['lib/']
};
