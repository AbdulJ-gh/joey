import { build } from 'esbuild';

function logBuildSuccess() {
	console.log(`\x1b[33m[${new Date().toISOString()}]\x1b[0m`, '🦘 Build succeeded ✅ ')
}

async function runBuild(data){
	try{
		await build(getOptions(data))
			.then(logBuildSuccess);
	} catch(err) {
		console.error(err)
	}
}

const options = {
	outfile: 'dist/index.js',
	sourcemap: false,
	watch: false,
	minify: true
}

const getOptions = (data) => {
  return {
    stdin: {
      contents: data.toString(),
      resolveDir: './',  // Should this be configurable?
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    target: 'esnext',
    outfile: options.outfile,
    sourcemap: options.sourcemap,
    minify: options.minify,
    color: true,
    // logLevel: 'debug',
    // tsconfig: 'tsconfig.json', // Add option?
    // logLimit: 10,
		watch: options.watch
			? { onRebuild(error) { error ? console.error(error) : logBuildSuccess(); } }
			: false,
  }
}

