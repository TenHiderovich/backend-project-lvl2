#!/usr/bin/env node

import program from 'commander';
import version from '../../package.json';
import gendiff from '..';

program
  .version(version)
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((path1, path2) => {
    try {
      console.log(gendiff(path1, path2, program.format));
    } catch (e) {
      throw new Error(e);
    }
  });

program.parse(process.argv);

if (program.args.length === 0) program.help();
