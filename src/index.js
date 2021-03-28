import _ from 'lodash';
import parser from './modules/parser';
import render from './modules/formatters';

const gendiff = (filepath1, filepath2, format) => {
  const fileContentBefore = parser(filepath1);
  const fileContentAfter = parser(filepath2);

  const iter = (before, after) => {
    const beforeKeys = _.keys(before);
    const afterKeys = _.keys(after);
    const sortedKeys = _.orderBy(_.uniq([...beforeKeys, ...afterKeys]));

    return sortedKeys.reduce((acc, name) => {
      const hasToBefore = beforeKeys.includes(name);
      const hasToAfter = afterKeys.includes(name);
      const obj = {
        key: name,
      };

      if (hasToBefore && hasToAfter) {
        obj.type = 'same';
        if (_.isObject(before[name]) && _.isObject(after[name])) {
          obj.children = iter(before[name], after[name]);
        } else if (before[name] !== after[name]) {
          obj.type = 'changed';
          obj.value = {
            before: after[name],
            after: before[name],
          };
        } else {
          obj.value = before[name];
        }
        return [...acc, obj];
      } if (!hasToBefore && hasToAfter) {
        obj.type = 'deleted';
        obj.value = after[name];
        return [...acc, obj];
      } if (hasToBefore && !hasToAfter) {
        obj.type = 'added';
        obj.value = before[name];
        return [...acc, obj];
      }

      return acc;
    }, []);
  };

  return render(iter(fileContentBefore, fileContentAfter), format);
};

export default gendiff;
