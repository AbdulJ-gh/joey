export default {
	require: ['./testUtils/testRuntimeGlobals.js'],
	files: ['src/**/*.test.ts', 'bin/**/*.test.ts'],
	typescript: {
		rewritePaths: {
			'src/': 'libTest/src/'
		},
		compile: false
	},
	verbose: true,
	cache: false,
	timeout: '10s',
	nodeArguments: ['--no-warnings=ExperimentalWarning', '--experimental-specifier-resolution=node']
};
