import TempFile from './tempFile';

export default class AppBuilder {
	public tmpAppFile: TempFile;

	constructor(tmpDir: string) {
		this.tmpAppFile = new TempFile(tmpDir, 'app.js');
	};

	write = (line: string, lineEnding = ';') => {
		this.tmpAppFile.write(`${line}${lineEnding}`)
	}

	writeMultiple = (lines: string[]) => {
		lines.forEach((line, index ) => {
			const lineEnding = index === lines.length - 1 ? ';' : ''
			this.tmpAppFile.write(`${line}${lineEnding}`)
		})
	}

	read = () => this.tmpAppFile.read();

	replace = (search: string, replace: string) => {
		const file = this.tmpAppFile.read();
		const update = file.replaceAll(search, replace)
		this.tmpAppFile.overwrite(update)
	}

};
