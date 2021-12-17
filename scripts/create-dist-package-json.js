const { readFileSync, writeFileSync } = require('fs');

const packageJson = JSON.parse(readFileSync('./package.json', { encoding: 'utf8' }));

delete packageJson.scripts;
delete packageJson.devDependencies;
delete packageJson.publishConfig;

writeFileSync('./lib/package.json', JSON.stringify(packageJson, null, 2));
