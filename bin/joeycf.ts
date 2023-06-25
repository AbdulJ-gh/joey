#!/usr/bin/env node
import main from './main.js';
import { throwError } from './helpers/index.js';

try{ await main(); }
catch(err){
	throwError(<string>err);
}
