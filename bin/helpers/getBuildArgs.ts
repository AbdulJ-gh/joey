import { ERRORS, throwError } from './errors.js';

export type BuildArgs = {
  outDir?: string;
  filename?: string;
  sourcemaps?: boolean;
  watch?: boolean;
}

function getBuildArgs(argv: string[]): BuildArgs {
  if (argv.length <= 2) { return {} }
  const args = argv.slice(2); // First two args are `node` and `joeycf`
  const buildArgs: BuildArgs = {};

  if (args.includes('--watch')) { buildArgs.watch = true; }
  if (args.includes('--sourcemaps')) { buildArgs.sourcemaps = true; }
  if (!args[0].startsWith('-')) {
    const { outDir, filename } = getOutFile(args[0])
    buildArgs.outDir = outDir;
    buildArgs.filename = filename;
  }
  return buildArgs;
}
/* Manually tested
 * []
 * [node]
 * [node','joeycf']
 * [node','joeycf', '--sourcemaps']
 * [node','joeycf', '--sourcemaps', '--watch']
 * ['node','joeycf', '--sourcemaps', '--watch', './dist/index.js'] // filepath ignored because it must come first
 * ['node','joeycf', './dist/index.js', '--sourcemaps', '--watch']
 * */


function getOutFile(path: string): { outDir: string, filename: string } {
  if (!path.endsWith('.js')) {
    throwError(ERRORS.BAD_OUTPUT_FILE)
  }

  const split = path.split('/')
  return {
    filename: split.pop() as string,
    outDir: split.join('/')
  }
}
/* Manually tested
 * dist/index.js
 * /dist/index.js
 * ./dist/index.js
 * index.js
 * /index.js
 * ./index.js
 * */

export default getBuildArgs;
