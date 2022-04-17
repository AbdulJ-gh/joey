const { readFileSync, cpSync, writeFileSync, copyFileSync } = require('fs');

const packageJson = JSON.parse(readFileSync('./package.json', { encoding: 'utf8' }));

delete packageJson.scripts;
delete packageJson.devDependencies;
delete packageJson.publishConfig;

writeFileSync('./lib/package.json', JSON.stringify(packageJson, null, 2));
copyFileSync('README.md', './lib/README.md')
cpSync('bin/joeycf.js', './lib/bin/joeycf')
