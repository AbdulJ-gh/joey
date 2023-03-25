import { readFileSync, writeFileSync, copyFileSync, renameSync, mkdirSync, readdirSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', { encoding: 'utf8' }));

delete packageJson.scripts;
delete packageJson.devDependencies;
delete packageJson.publishConfig;
delete packageJson.type;

writeFileSync('./lib/package.json', JSON.stringify(packageJson, null, 2));
copyFileSync('README.md', './lib/README.md')
renameSync('./lib/bin/joeycf.js', './lib/bin/joeycf') // specified in the package.json now

// Fs schemas
mkdirSync('./lib/bin/schemas/refs', { recursive: true })
const refs = readdirSync('./bin/schemas/refs')
refs.forEach(ref => {
	copyFileSync(`./bin/schemas/refs/${ref}`, `./lib/bin/schemas/refs/${ref}`)
})
copyFileSync('./bin/schemas/worker.json', './lib/bin/schemas/worker.json')
copyFileSync('./bin/buildOptions.js', './lib/bin/buildOptions.js')
