#!/usr/bin/env node

import { program } from 'commander';
import { version, description } from '../../package.json';
import gendiff from '..';

program
  .version(version)
  .arguments('<filepath1> <filepath2>')
  .description(description)
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((path1, path2, options) => {
    try {
      console.log(gendiff(path1, path2, options.format));
    } catch (e) {
      throw new Error(e);
    }
  })
  .parse(process.argv);

if (program.args.length === 0) program.help();
