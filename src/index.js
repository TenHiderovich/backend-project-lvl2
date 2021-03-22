import path from 'path';
import process from 'process';
import { readFile } from 'fs';
import _ from 'lodash';

const currentDir = process.cwd();
// const path = path.resolve('/');

export default (filepath1, filepath2, options) => {
  readFile(filepath1, 'utf8', (err1, data1) => {
    if (err1) throw err1;

    readFile(filepath2, 'utf8', (err2, data2) => {
      if (err2) throw err2;

      const file1 = JSON.parse(data1);
      const file2 = JSON.parse(data2);
      const keys1 = _.keys(file1);
      const keys2 = _.keys(file2);
      const sortedKeys = _.orderBy(_.uniq([...keys1, ...keys2]));

      const result = sortedKeys.reduce((acc, name) => {
        const hasToFile1 = keys1.includes(name);
        const hasToFile2 = keys2.includes(name);

        if (hasToFile1 && hasToFile2 && file1[name] === file2[name]) {
          return acc + `    ${name}: ${file1[name]}\n`;
        } else if (hasToFile1 && hasToFile2 && file1[name] !== file2[name]) {
          return acc + `  - ${name}: ${file1[name]}\n  + ${name}: ${file2[name]}\n`;
        } else if (hasToFile2 && !hasToFile1) {
          return acc + `  + ${name}: ${file2[name]}\n`;
        } else if (hasToFile1 && !hasToFile2) {
          return acc + `  - ${name}: ${file1[name]}\n`;
        } else {
          return acc;
        };
      }, '');

      console.log(`{\n${result}}`);
    });
  });
};