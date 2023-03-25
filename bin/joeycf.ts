#!/usr/bin/env node
import main from './main.js';
import { throwError } from './helpers/index.js';

try{ main(); }
catch(err){
	throwError(<string>err);
}
