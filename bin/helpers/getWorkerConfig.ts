import { join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { parse as parseYaml } from 'yaml';
import { getBuildArgs, throwError, ERRORS } from './index.js';
const { argv, cwd } = process;


export default function getWorkerConfig () {
  const buildArgs = getBuildArgs(argv);
  const dir = cwd();

	const configs = readdirSync(dir)
    .filter(file => file.startsWith('worker.'));

	if (configs.length === 0) { throwError(ERRORS.NO_FILE); }

	if (configs.includes('worker.json')) {
    const config = JSON.parse(readFileSync(join(dir, 'worker.json'), 'utf8'));
		return { ...config, ...buildArgs };
	}


	if (configs.includes('worker.yaml') || configs.includes('worker.yml')) {
		const yaml = readFileSync(join(
			dir,
			configs.includes('worker.yaml') ? 'worker.yaml' : 'worker.yml'
		), 'utf8');

		return { ...parseYaml(yaml), ...buildArgs };
	}

  throwError(ERRORS.NO_FILE)
}
