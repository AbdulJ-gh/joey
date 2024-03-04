import { build } from 'esbuild';
import { cpSync } from 'fs';

build({
	bundle: true,
	format: 'esm',
	platform: 'node',
	target: 'esnext',
	minify: true,
	tsconfig: 'tsconfig.bin.json',
	color: true,
	entryPoints: ["./bin/joeycf"],
	outdir: 'lib/bin',
	external: ['fast-glob', 'esbuild']
}).then(() => {
	console.log("-- -- -- -- --\n\n");
})

cpSync('./bin/schemas', './lib/bin/schemas', { recursive: true });
cpSync('./bin/build/esbuildOptions.js', './lib/bin/build/esbuildOptions.js');
