import { join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { parse as parseYaml } from 'yaml';
import applyDefault from './applyDefaults';


export default function getWorkerConfig () {
	const { stderr, cwd, exit } = process;

	const configs = readdirSync(join(cwd())).filter(file => file.startsWith('worker.'));

	function missingConfig() {
		stderr.write('Joeycf error: Expected a worker.yaml or worker.yml or worker.json file in project root\n');
		exit(1);
	}

	if (configs.length === 0) { missingConfig(); }


	if (configs.includes('worker.json')) {
		return applyDefault(JSON.parse(readFileSync(join(cwd(), 'worker.json'), 'utf8')));
	}


	if (configs.includes('worker.yaml') || configs.includes('worker.yml')) {
		const yaml = readFileSync(join(
			cwd(),
			configs.includes('worker.yaml') ? 'worker.yaml' : 'worker.yml'
		), 'utf8');
		return applyDefault(parseYaml(yaml).worker);
	}

	missingConfig()
}

