import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'fs';
import { join, sep } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import { spawn } from 'child_process';
import { TempFile } from './index.js';

const { cwd, stdout, stderr } = process;


export function finalBuild(app: any, build: any) {
	const tempDir = mkdtempSync(tmpdir() + sep);

	if (existsSync(build.outDir)) {
		// Clears previous build first
		rmSync(build.outDir, { recursive: true });
	}
	const tmpBuildDir = join(cwd(), build.outDir, 'tmp');
	mkdirSync(tmpBuildDir, { recursive: true });
	const __dirname = fileURLToPath(new URL('.', import.meta.url));
	const buildJs = new TempFile(tmpBuildDir, 'build.js', readFileSync(join(__dirname, '../buildOptions.js')).toString());

	buildJs.write(`options.outfile = '${join(cwd(), build.outDir, build.filename)}';`);
	buildJs.write(`options.sourcemap = ${build.sourcemaps};`);
	if (build.watch) {
		buildJs.write('options.watch = true')
	}
	if (!build.minify) {
		buildJs.write('options.minify = false')
	}
	buildJs.write(`process.stdin.on('data',async data=>{ runBuild(data) })`);
	/** ES BUILD */

		// Compiled app and Execute esbuild
	const buildProcess = spawn('node', [buildJs.path]);
	buildProcess.stdout.pipe(stdout); // Pipes child process stdout to process.stdout
	buildProcess.stderr.pipe(stderr);  // Pipes child process stderr to process.stderr
	buildProcess.stdin.write(app); // Streams the `app` file to the stdin of the child process
	buildProcess.stdin.end(); // Ends the stdin to child process


	const clearTmpData = () => {
		if (existsSync(tempDir)) {
			rmSync(tempDir, { recursive: true });
		}
		if (existsSync(tmpBuildDir)) {
			rmSync(tmpBuildDir, { recursive: true });
		}
	};

	buildProcess.stdout.on('data', clearTmpData);
	buildProcess.stderr.on('data', () => clearTmpData());
}
