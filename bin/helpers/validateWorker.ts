import { spawnSync } from 'child_process';
import { join } from 'path';
import _ from 'lodash';
import { TempFile, throwError, ERRORS } from './index.js';
import type { Worker } from '../types.js';
const { stderr } = process;

type ReturnType = {
  handlerNames: string[];
  middlewareNames: string[];
}

type Change = { op: string, path: string, value: any };

export default function validateWorker(worker: Worker, tmpDir: string): ReturnType {
  const workerFile = new TempFile(tmpDir, 'worker.json', JSON.stringify(worker))

  const validateWorker = spawnSync('ajv', [
    'validate',
    '-r', join(__dirname, '../schemas/refs/*.json'),
    '-s', join(__dirname, '../schemas/worker.json'),
    '-d', workerFile.path,
    '--use-defaults',
		'--strict=false',
    '--allow-matching-properties',
    '--all-errors',
    '--errors=json',
    '--allow-union-types',
    '--changes=json'
  ]);

  if (validateWorker.status !== 0) {
    const message = validateWorker.stderr.toString('utf8')
    if (message.includes('invalid')) { stderr.write(message.split('invalid')[1]); }
    throwError(ERRORS.INVALID_WORKER_CONFIG)
  }

  const changes = JSON.parse(validateWorker.output.toString()
    .split('changes:')[1]
    .slice(0, -1));

  changes.forEach(({ op, path, value }: Change) => {
    if (op === 'add') {
      const paths = path.slice(1).split('/')
      _.set(worker, paths, value)
    }
  })

  return {
    handlerNames: Object.keys(worker.handlers),
    middlewareNames: Object.keys(worker.middleware)
  }
}
