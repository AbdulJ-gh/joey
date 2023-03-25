export type Handler = {
  route: string;
  method: string;
  src: string;
  options?: Record<string, string>;
  middleware: string[];
	schema?: {
		path?: string;
		query?: string;
		body?: string;
	};
}

export type Worker = {
  handlersRoot: string,
	middlewareRoot: string,
  logger: string
	schemas: string,
  build: { outDir: string, filename: string, sourcemaps: boolean, watch: boolean, minify: boolean }
  middleware: Record<string, string>,
  baseConfig: {
    middleware: string[],
    options: Record<string, unknown>,
		defaultResponses: Record<string, unknown>,
  }
  handlers: Record<string, Handler>
}
