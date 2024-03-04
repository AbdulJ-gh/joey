import { exit } from 'process';
import { joeyLog } from '../io';

function throwBuildError(message: string): number {
	joeyLog(`Build Error ❌ \n\t${message}\n`);
	exit(1);
}

export { throwBuildError };
