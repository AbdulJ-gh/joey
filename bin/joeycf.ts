#!/usr/bin/env node
import main from './main';
import { throwBuildError } from './errors';

try {
	await main();
} catch (err) {
	throwBuildError(<string>err);
}
