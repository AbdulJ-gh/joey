import { TempFile } from './';
import _ from 'lodash';

export default class Composer {
	public tmpAppFile: TempFile;

	constructor(tmpDir: string) {
		this.tmpAppFile = new TempFile(tmpDir, 'app.js');
	};

	public write = (line: string, lineEnding = ';') => {
		this.tmpAppFile.write(`${line}${lineEnding}`)
	}

	public read = () => this.tmpAppFile.read();

	public replace = (search: string, replace: string) => {
		const file = this.tmpAppFile.read();
		const update = file.replaceAll(search, replace)
		this.tmpAppFile.overwrite(update)
	}

  public readonly steps = {
    IMPORT_JOEY: () => this.write(`import Joey from 'joeycf'`),
    IMPORT_HANDLER: (name: string, file: string) => this.write(`import ${_.camelCase(name)} from '${file}'`),
    IMPORT_LOGGER_INTERFACE: () => this.write(`import { Logger } from 'joeycf/Logger'`),
    IMPORT_LOGGER: (file: string) => this.write(`import logger from '${file}'`),
    DECLARE_MIDDLEWARE: (middleware: string[]) => {
      this.write(`const middleware = ${JSON.stringify(middleware)}`, ';\n');
    },
    DECLARE_PATHS: (paths: Record<string, any>) => {
      this.write(`const paths = ${JSON.stringify(paths)}`, ';\n');
    },
    DECLARE_CONFIG: (config: Record<string, unknown>) => {
      this.write(`const config = ${JSON.stringify(config)}`, ';\n')
    },
    DECLARE_LOGGER_INIT: () => {
      this.write(`const loggerInit = (logger,request,ctx,env)=>Logger['event'](logger,request,ctx,env)`);
    },
    NO_LOGGER: () => this.write('let logger, loggerInit') ,
    REPLACE_UNSAFE_HANDLER_NAME: (name: string) => {
      this.replace(`"__UNSAFE_HANDLER_NAME__${name}"`, _.camelCase(name))
    },
    REPLACE_UNSAFE_MIDDLEWARE_NAME: (name: string) => {
      this.replace(`"__UNSAFE_MIDDLEWARE_NAME__${name}"`, _.camelCase(name))
    },
    EXPORT: () => this.write('\nexport default new Joey(paths,config,middleware,logger,loggerInit)')
  }
};
