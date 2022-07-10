import { spawnSync } from 'child_process';
import { join } from 'path';
import _ from 'lodash';
import { TempFile, throwError, ERRORS } from './';
import { Worker } from '../types';
const { stderr } = process;
// TODO - THIS SHOULD BE A SEPARATE FUNCTION

type DUH = {
  handlerNames: string[];
  middlewareNames: string[];
}

type Change = { op: string, path: string, value: any };

export default function validateWorker(worker: Worker, tmpDir: string): DUH {
  const workerFile = new TempFile(tmpDir, 'worker.json', JSON.stringify(worker))

  const validateWorker = spawnSync('ajv', [
    'validate',
    '-r', join(__dirname, '../schemas/refs/*.json'),
    '-s', join(__dirname, '../schemas/worker.json'),
    '-d', workerFile.path,
    '--use-defaults',
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

  /** DEBUG */
  console.log('WORKER ISSSSS', worker);
  console.log('HANDLER IS', worker.handlers);
  console.log('CONFIG IS', worker.baseConfig);
  /** DEBUG */

  return {
    handlerNames: Object.keys(worker.handlers),
    middlewareNames: Object.keys(worker.middleware)
  }
}
