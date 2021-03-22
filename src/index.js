import path from 'path';
import process from 'process';
import {
  readFileSync
} from 'fs';
import _ from 'lodash';


export default (filepath1, filepath2, options) => {
  let fileContent1 = readFileSync(path.resolve(filepath1), "utf8");
  let fileContent2 = readFileSync(path.resolve(filepath2), "utf8");

  const file1 = JSON.parse(fileContent1);
  const file2 = JSON.parse(fileContent2);
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

};