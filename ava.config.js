export default {
	require: ['./testUtils/testRuntimeGlobals.js'],
	files: ['src/**/*.test.ts'],
	typescript: {
		rewritePaths: { 'src/': 'lib/src/' },
		compile: 'tsc'
	},
	verbose: true,
	cache: false,
	timeout: '10s',
	ignoredByWatcher: ['lib/**/*'],
	nodeArguments: ['--experimental-specifier-resolution=node']
};
