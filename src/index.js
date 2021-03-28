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
      const obj = {
        key: name,
      };

      if (hasToBefore && hasToAfter) {
        if (_.isObject(before[name]) && _.isObject(after[name])) {
          obj.type = 'same';
          obj.children = iter(before[name], after[name]);
        } else if (before[name] !== after[name]) {
          obj.type = 'changed';
          obj.value = {
            before: after[name],
            after: before[name],
          };
        } else {
          obj.type = 'same';
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

  return iter(fileContentBefore, fileContentAfter);
};

export default gendiff;
