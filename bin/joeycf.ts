#!/usr/bin/env node
import { readFileSync, mkdtempSync } from "fs";
import { join, sep } from 'path';
import { spawn } from 'child_process';
import { parse as yaml } from 'yaml';
const { tmpdir } = require('os');

// Args
const { argv, cwd } = process;
const cli = argv[2] === '--esbuild-cli';
const esbuildArgs = cli ? argv.slice(3) : [ join(cwd(), argv[2]) ]; // build.js arg must be relative to package.json dir

// Parse yaml
const doc = yaml(readFileSync('./worker.yaml', 'utf8'));

// Create temp file
const tmpFile = mkdtempSync(tmpdir() + sep)
// Do stuff here...

// Placeholder joey compiled app
const app = readFileSync('./src/index.ts', 'utf8');

// Execute esbuild
const exec = spawn(cli ? 'esbuild' : 'node', esbuildArgs);
exec.stdout.pipe(process.stdout);
exec.stdin.write(app);
exec.stdin.end();
