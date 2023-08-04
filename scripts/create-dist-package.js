import { readFileSync, writeFileSync, copyFileSync, mkdirSync, readdirSync, rmSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', { encoding: 'utf8' }));

delete packageJson.scripts;
delete packageJson.devDependencies;

writeFileSync('./lib/package.json', JSON.stringify(packageJson, null, 2));
copyFileSync('README.md', './lib/README.md')

// Fs schemas
mkdirSync('./lib/bin/schemas/refs', { recursive: true })
const refs = readdirSync('./bin/schemas/refs')
refs.forEach(ref => {
	copyFileSync(`./bin/schemas/refs/${ref}`, `./lib/bin/schemas/refs/${ref}`)
})
copyFileSync('./bin/schemas/worker.json', './lib/bin/schemas/worker.json')
copyFileSync('./bin/buildOptions.js', './lib/bin/buildOptions.js')
rmSync('./lib/testUtils', { recursive: true, force: true  });
