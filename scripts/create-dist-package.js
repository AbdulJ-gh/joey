import { readFileSync, writeFileSync, copyFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', { encoding: 'utf8' }));

delete packageJson.scripts;
delete packageJson.devDependencies;

writeFileSync('./lib/package.json', JSON.stringify(packageJson, null, 2));
copyFileSync('README.md', './lib/README.md')

