import { mkdtempSync, mkdirSync, readFileSync, existsSync, rmSync } from 'fs';
import { spawn } from 'child_process';
import { join, sep } from 'path';
import { tmpdir } from 'os';

import { Composer, TempFile, getWorkerConfig, validateWorker, throwError, ERRORS } from './helpers';
import { Worker } from './types'

const { cwd, stdout, stderr } = process;

export default function main() {
  const worker = <Worker>getWorkerConfig();
  const tempDir = mkdtempSync(tmpdir() + sep);
  const { handlerNames, middlewareNames } = validateWorker(worker, tempDir);
  const { src, handlersRoot, logger, build, handlers, middleware, baseConfig } = worker;

  const app = new Composer(tempDir);
  app.steps.IMPORT_JOEY();

  handlerNames.forEach(name => {
    app.steps.IMPORT_HANDLER(name, './' + join(src, handlersRoot, handlers[name].src));
  });

  middlewareNames.forEach(name => {
    app.steps.IMPORT_HANDLER(name, './' + join(src, middleware[name]));
  });

  if (logger) {
    app.steps.IMPORT_LOGGER_INTERFACE();
    app.steps.IMPORT_LOGGER('./' + join(src, logger));
  }

  app.steps.DECLARE_CONFIG(baseConfig.options);

  const mapUnsafeMiddleware = (middleware: string[]) => middleware.map(name => `__UNSAFE_MIDDLEWARE_NAME__${name}`);
  const globalMiddleware = mapUnsafeMiddleware(baseConfig.middleware);
  app.steps.DECLARE_MIDDLEWARE(globalMiddleware);

  const paths: Record<string, any> = {};
  handlerNames.forEach((name) => {
    const { route, method, options, middleware } = handlers[name];

    if (!paths[route]) { paths[route] = {}; }

    if (paths[route][method]) {
      throwError(ERRORS.DUPLICATE_HANDLER(`${method.toUpperCase()} ${route}`));
    }

    paths[route][method] = {
      handler: `__UNSAFE_HANDLER_NAME__${name}`,
      path: route,
      config: options,
      middleware: mapUnsafeMiddleware(middleware)
    };
  })
  app.steps.DECLARE_PATHS(paths);


  handlerNames.forEach(name => app.steps.REPLACE_UNSAFE_HANDLER_NAME(name));
  middlewareNames.forEach(name => app.steps.REPLACE_UNSAFE_MIDDLEWARE_NAME(name));
  logger ? app.steps.DECLARE_LOGGER_INIT() : app.steps.NO_LOGGER();
  app.steps.EXPORT();

	const finalApp = app.read();
	if (finalApp.includes('__UNSAFE_MIDDLEWARE_NAME__')) {
		throwError(ERRORS.MISSING_MIDDLEWARE_DECLARATION);
	}


  /** ES BUILD */
  const tmpBuildDir = join(cwd(), build.outDir, 'tmp');
  mkdirSync(tmpBuildDir, { recursive: true });
  const buildJs = new TempFile(tmpBuildDir, 'build.js', readFileSync(join(__dirname, 'buildOptions.js')).toString());

  buildJs.write(`overrides.outfile = '${join(cwd(), build.outDir, build.filename)}';`);
  buildJs.write(`overrides.sourcemap = ${build.sourcemaps};`);
  if (build.watch) { buildJs.write('overrides.watch = true') }
  buildJs.write(`process.stdin.on('data',async data=>{ runBuild(data) })`);
  /** ES BUILD */

  // Compiled app and Execute esbuild
  const buildProcess = spawn('node', [buildJs.path]);
  buildProcess.stdout.pipe(stdout); // Pipes child process stdout to process.stdout
  buildProcess.stderr.pipe(stderr);  // Pipes child process stderr to process.stderr
  buildProcess.stdin.write(finalApp); // Streams the `app` file to the stdin of the child process
  buildProcess.stdin.end(); // Ends the stdin to child process

  // Todo
  // No dist/index.js file already, Wrangler shows an error to say it couldn't find the file. Could confuse users
  // Trying to set a --verbose flag or option?

  const clearTmpData = () => {
    if (existsSync(tempDir)) { rmSync(tempDir, { recursive: true }); }
    if (existsSync(tmpBuildDir)) { rmSync(tmpBuildDir, { recursive: true }); }
  };

  buildProcess.stdout.on('data', clearTmpData);
  buildProcess.stderr.on('data', () => clearTmpData());
}
