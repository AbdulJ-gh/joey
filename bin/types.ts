export type Handler = {
  route: string;
  method: string;
  src: string;
  options?: Record<string, string>;
  middleware: string[];
  schema: string[];
}

export type Worker = {
  src: string,
  handlersRoot: string,
  logger: string,
  schemas: string,
  build: { outDir: string, filename: string, sourcemaps: boolean, watch: boolean }
  middleware: Record<string, string>,
  baseConfig: {
    middleware: string[],
    options: Record<string, unknown>
  }
  handlers: Record<string, Handler>
}
