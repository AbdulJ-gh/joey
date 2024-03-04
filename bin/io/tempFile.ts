import { writeFileSync, readFileSync } from 'fs';

export class TempFile {
	public tmpDir: string;
	public path: string;

	constructor(tmpDir: string, filename: string, initialWrite?: string) {
		this.tmpDir = tmpDir;
		this.path = `${tmpDir}/${filename}`;
		if (initialWrite) { this.overwrite(initialWrite); }
	}

	write(line: string) {
		writeFileSync(this.path, `${line}\n`, { flag: 'a+' });
	}

	overwrite(string: string) {
		writeFileSync(this.path, string);
	}

	read(): string {
		return readFileSync(this.path, 'utf8');
	}
}
