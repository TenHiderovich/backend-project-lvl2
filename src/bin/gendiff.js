#!/usr/bin/env node

import program from 'commander';
import { version } from '../../package.json';

program
  .version(version)
  .arguments('<firstValue> <secondValue>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')

program.parse(process.argv);

if (program.args.length === 0) program.help();