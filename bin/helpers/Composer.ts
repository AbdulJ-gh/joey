import TempFile from './tempFile.js';
import _ from 'lodash';

type Import = { name: string, path: string };

type InitialWriteValues = {
	handlerImports: Import[],
	middlewareImports: Import[],
	config: any,
	globalMiddleware: string[],
	validatorsPath: string,
	paths: any,
	logger?: string,
}

export default class Composer {
	private tmpAppFile: TempFile;

	constructor(private tmpDir: string) {
		this.tmpAppFile = new TempFile(tmpDir, 'app.js');
	}

	private write = (line: string, lineEnding = ';') => {
		this.tmpAppFile.write(`${line}${lineEnding}`)
	}

	public read = () => this.tmpAppFile.read();

	public replace = (search: string, replace: string) => {
		const file = this.tmpAppFile.read();
		const update = file.replaceAll(search, replace)
		this.tmpAppFile.overwrite(update)
	}

	/** Initial Write */
	private importModule = ({ name, path }: Import) => this.write(`import ${name} from '${path}'`);
	private importList = (list: Import[]): void => list.forEach(this.importModule);
	public initialWrite = (initialWriteValues: InitialWriteValues) => {
		const { handlerImports, middlewareImports, config, globalMiddleware, validatorsPath, paths, logger } = initialWriteValues
		const { importModule, importList } = this;
		this.write(`import Joey from 'joeycf'`);
		if (logger) {
			this.write(`import { Logger } from 'joeycf/Logger`);
			importModule({ name: 'logger', path: logger });
			this.write(`const loggerInit = (logger,request,ctx,env)=>Logger['event'](logger,request,ctx,env)`)
		} else {
			this.write(`let logger, loggerInit`)
		}
		importList(handlerImports);
		importList(middlewareImports);
		this.write(`\nconst config = ${JSON.stringify(config)}`);
		this.write(`\nconst middleware = ${JSON.stringify(globalMiddleware)}`);
		this.write(`\nimport * as validators from '${validatorsPath}'`);
		this.write(`\nconst paths = ${JSON.stringify(paths)}`);
		this.write('\nconst joey = new Joey(paths,config,middleware,logger,loggerInit)')
		this.write('\nconst { fetch, queue, scheduled } = joey')
		this.write('\nexport default { fetch, queue, scheduled  }')
	}
	/** Initial Write */

	/** Cleanup */
  private REPLACE_UNSAFE_HANDLER_REF = (name: string) => {
		this.replace(`"__UNSAFE_HANDLER_REF__${name}"`, _.camelCase(name))
	};
	private REPLACE_UNSAFE_MIDDLEWARE_REF = (name: string) => {
		this.replace(`"__UNSAFE_MIDDLEWARE_REF__${name}"`, _.camelCase(name))
	};
	private REPLACE_UNSAFE_VALIDATOR_REFS = () => {
		this.replace(`"__UNSAFE_VALIDATOR_REF__`, '');
		this.replace(`__UNSAFE_VALIDATOR_REF__"`, '');
	};
	public cleanUnsafeRefs = (
		handlerImports: string[],
		middlewareImports: string[],
	) => {
		handlerImports.forEach(this.REPLACE_UNSAFE_HANDLER_REF)
		middlewareImports.forEach(this.REPLACE_UNSAFE_MIDDLEWARE_REF)
		this.REPLACE_UNSAFE_VALIDATOR_REFS()
	};
	/** Cleanup */

	/** Static methods */
	public static unsafeMiddlewareDeclaration = ((name: string): string => `__UNSAFE_MIDDLEWARE_REF__${name}`)
	/** Static methods */
}
