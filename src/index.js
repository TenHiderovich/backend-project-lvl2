import path from 'path';
import process from 'process';
import { readFile } from 'fs';

const currentDir = process.cwd();
// const path = path.resolve('/');

export default (filepath1, filepath2, options) => {
  console.log(filepath1, filepath2, options)
};