export default {
	require: ['./testUtils/testRuntimeGlobals.js'],
	files: ['src/**/*.test.ts', 'bin/**/*.test.ts'], // TODO - make bin tests run
	typescript: {
		rewritePaths: { 'src/': 'lib/src/' },
		compile: 'tsc'
	},
	verbose: true,
	cache: false,
	timeout: '10s',
	ignoredByWatcher: ['lib/**/*'],
	nodeArguments: ['--no-warnings=ExperimentalWarning', '--experimental-specifier-resolution=node']
};
