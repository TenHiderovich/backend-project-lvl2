import _ from 'lodash';
import parser from './modules/parser';

const gendiff = (filepath1, filepath2) => {
  const fileContentBefore = parser(filepath1);
  const fileContentAfter = parser(filepath2);

  const iter = (before, after) => {
    const beforeKeys = _.keys(before);
    const afterKeys = _.keys(after);
    const sortedKeys = _.orderBy(_.uniq([...beforeKeys, ...afterKeys]));

    return sortedKeys.reduce((acc, name) => {
      const hasToBefore = beforeKeys.includes(name);
      const hasToAfter = afterKeys.includes(name);

      if (hasToBefore && hasToAfter) {
        const obj = {
          key: name,
          type: 'same',
        };
        if (_.isObject(before[name]) && _.isObject(after[name])) {
          obj.children = iter(before[name], after[name]);
        } else {
          obj.value = before[name];
        }
        return [...acc, obj];
      } if (hasToBefore && hasToAfter && !_.eq(before, after)) {
        const obj = {
          key: name,
          type: 'changed',
          value: {
            before: before[name],
            after: after[name],
          },
        };
        return [...acc, obj];
      } if (!hasToBefore && hasToAfter) {
        const obj = {
          key: name,
          type: 'deleted',
          value: after[name],
        };
        return [...acc, obj];
      } if (hasToBefore && !hasToAfter) {
        const obj = {
          key: name,
          type: 'added',
          value: before[name],
        };
        return [...acc, obj];
      }

      return acc;
    }, []);
  };

  return iter(fileContentBefore, fileContentAfter);
};

export default gendiff;
