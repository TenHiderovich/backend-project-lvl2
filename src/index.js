import _ from 'lodash';
import parser from './parser.js';
import formatter from './formatters/index.js';

const gendiff = (filepath1, filepath2, format = 'stylish') => {
  const fileContentBefore = parser(filepath1);
  const fileContentAfter = parser(filepath2);

  const iter = (before, after) => {
    const beforeKeys = _.keys(before);
    const afterKeys = _.keys(after);
    const uniqKeys = _.uniq([...beforeKeys, ...afterKeys]);
    const sortedKeys = _.orderBy(uniqKeys);

    return sortedKeys.reduce((acc, name) => {
      const hasToBefore = _.includes(beforeKeys, name);
      const hasToAfter = _.includes(afterKeys, name);

      if (hasToBefore && hasToAfter) {
        if (_.isObject(before[name]) && _.isObject(after[name])) {
          const children = iter(before[name], after[name]);
          return [...acc, { key: name, type: 'same', children }];
        }

        if (!_.isEqual(before[name], after[name])) {
          const value = {
            before: before[name],
            after: after[name],
          };
          return [...acc, { key: name, type: 'changed', value }];
        }

        return [...acc, { key: name, type: 'same', value: after[name] }];
      }

      if (hasToBefore && !hasToAfter) {
        return [...acc, { key: name, type: 'deleted', value: before[name] }];
      }

      if (!hasToBefore && hasToAfter) {
        return [...acc, { key: name, type: 'added', value: after[name] }];
      }

      return acc;
    }, []);
  };

  return formatter(iter(fileContentBefore, fileContentAfter), format);
};

export default gendiff;
