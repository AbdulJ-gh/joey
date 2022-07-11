import { build } from 'esbuild';

function logBuildSuccess() {
	console.log(`[${new Date().toISOString()}]`, 'Build succeeded 🦘✅ ')
}

async function runBuild(data){
	try{
		await build(getOptions(data))
			.then(logBuildSuccess);
	} catch(err) {
		console.error(err)
	}
}

const overrides = {
	outfile: 'dist/index.js',
	sourcemap: false,
	watch: false,
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
    outfile: overrides.outfile,
    sourcemap: overrides.sourcemap,
    minify: true,
    color: true,
    logLevel: 'debug',
    // tsconfig: 'tsconfig.json', // Add option?
    // logLimit: 10,
		watch: overrides.watch
			? { onRebuild(error) { error ? console.error(error) : logBuildSuccess(); } }
			: false,
  }
}

