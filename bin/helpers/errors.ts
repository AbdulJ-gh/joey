const { stderr, exit } = process;

const ERRORS = {
  NO_FILE: 'Expected a worker.yaml or worker.yml or worker.json file in project root',
  BAD_OUTPUT_FILE: 'Output file must end with .js',
  INVALID_WORKER_CONFIG: 'Invalid worker configuration, see the error above and check your configuration',
  DUPLICATE_HANDLER: (handler: string) =>  `Duplicate handler declared for ${handler}`
}

function throwError(message: string) {
  stderr.write(`Joeycf Error: ${message}\n`);
  exit(1);
}

export { ERRORS, throwError, }
