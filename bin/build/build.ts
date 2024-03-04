import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { TempFile } from '../io';
import type { Worker } from '../config';

export function finalBuild(app: string, build: Worker['build'], tempDir: string) {
	// Clears previous build first
	if (existsSync(build.outDir)) {
		rmSync(build.outDir, { recursive: true });
	}
	// Make temp build directory
	const tmpBuildDir = join(process.cwd(), build.outDir, 'tmp');
	mkdirSync(tmpBuildDir, { recursive: true });
	const __dirname = fileURLToPath(new URL('.', import.meta.url));

	// Copy base esbuild options template file
	const buildJs = new TempFile(
		tmpBuildDir,
		'build.js',
		readFileSync(join(__dirname, './build/esbuildOptions.js')).toString()
	);

	// Apply user options
	buildJs.write(`options.outfile = '${join(process.cwd(), build.outDir, build.filename)}';`);
	buildJs.write(`options.sourcemap = ${build.sourcemaps};`);
	if (build.watch) { buildJs.write('options.watch=true'); }
	if (!build.minify) { buildJs.write('options.minify=false'); }
	buildJs.write("process.stdin.on('data',async data=>{ runBuild(data) })");

	// Compiled app and Execute esbuild
	const buildProcess = spawn('node', [buildJs.path]);
	buildProcess.stdout.pipe(process.stdout); // Pipes child process stdout to process.stdout
	buildProcess.stderr.pipe(process.stderr); // Pipes child process stderr to process.stderr
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


/*
import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { TempFile } from '../io';
import type { Worker } from '../config';

export function finalBuild(app: string, build: Worker['build'], tempDir: string) {
	const buildDir = join(process.cwd(), build.outDir);

	// Clears previous build first
	if (existsSync(buildDir)) {
		rmSync(buildDir, { recursive: true });
	}
	// Make temp build directory
	const tmpBuildDir = join(buildDir, 'tmp');
	mkdirSync(tmpBuildDir, { recursive: true });
	const __dirname = fileURLToPath(new URL('.', import.meta.url));

	// Copy base esbuild options template file
	const buildJs = new TempFile(
		tmpBuildDir,
		'build.js',
		readFileSync(join(__dirname, './build/esbuildOptions.js')).toString()
	);

	// Apply user options
	buildJs.write(`options.outfile = '${join(buildDir, build.filename)}';`);
	buildJs.write(`options.sourcemap = ${build.sourcemaps};`);
	if (build.watch) { buildJs.write('options.watch=true'); }
	if (!build.minify) { buildJs.write('options.minify=false'); }
	buildJs.write("process.stdin.on('data',async data=>{ runBuild(data) })");

	// Compiled app and Execute esbuild
	const buildProcess = spawn('node', [buildJs.path]);
	buildProcess.stdout.pipe(process.stdout); // Pipes child process stdout to process.stdout
	buildProcess.stderr.pipe(process.stderr); // Pipes child process stderr to process.stderr
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

*/
