// import path from 'path';
// import fs from 'fs';
import _ from 'lodash';
import parser from './parser';

export default (filepath1, filepath2) => {
  const fileContentBefore = parser(filepath1);
  const fileContentAfter = parser(filepath2);

  const beforeKeys = _.keys(fileContentBefore);
  const afterKeys = _.keys(fileContentAfter);
  const sortedKeys = _.orderBy(_.uniq([...beforeKeys, ...afterKeys]));

  const result = sortedKeys.reduce((acc, name) => {
    const hasToBefore = beforeKeys.includes(name);
    const hasToAfter = afterKeys.includes(name);
    let newAcc = '';
    if (hasToBefore && hasToAfter && fileContentBefore[name] === fileContentAfter[name]) {
      newAcc = `${acc}    ${name}: ${fileContentBefore[name]}\n`;
    } else if (hasToBefore && hasToAfter && fileContentBefore[name] !== fileContentAfter[name]) {
      newAcc = `${acc}  - ${name}: ${fileContentBefore[name]}\n  + ${name}: ${fileContentAfter[name]}\n`;
    } else if (hasToAfter && !hasToBefore) {
      newAcc = `${acc}  + ${name}: ${fileContentAfter[name]}\n`;
    } else if (hasToBefore && !hasToAfter) {
      newAcc = `${acc}  - ${name}: ${fileContentBefore[name]}\n`;
    } else {
      newAcc = acc;
    }
    return newAcc;
  }, '');

  return `{\n${result}}`;
};
