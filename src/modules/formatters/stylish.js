import _ from 'lodash';

const getIndent = (depth) => {
  const spaceCount = 4;
  return ' '.repeat(spaceCount).repeat(depth);
};

const objectToStr = (object, depth) => {
  const depthStep = 1;
  const nextDepth = depth + depthStep;
  const indent = getIndent(depth);
  const entries = Object.entries(object);
  const { length: entriesCount } = entries;

  const result = entries.reduce((acc, entrie, index) => {
    const [key, value] = entrie;
    const newValue = _.isObject(value) ? objectToStr(value, nextDepth) : value;
    const lineBreak = (entriesCount > 1 && index !== entriesCount - 1) ? '\n' : '';

    return `${acc}${indent}${key}: ${newValue}${lineBreak}`;
  }, '');

  return `{\n${result}\n${getIndent(depth - depthStep)}}`;
};

const getFormattedValue = (value, depth) => (_.isObject(value) ? objectToStr(value, depth) : value);

const stylish = (tree) => {
  const iter = (innerTree, depth) => {
    const depthStep = 1;
    const nextDepth = depth + depthStep;
    const indent = getIndent(depth - depthStep);

    return innerTree.reduce((acc, item) => {
      const { key, value, children } = item;
      switch (item.type) {
        case 'same': {
          const innerValue = children !== undefined
            ? `{\n${iter(children, nextDepth)}    ${indent}}`
            : `${value}`;
          return `${acc}${indent}    ${key}: ${innerValue}\n`;
        }
        case 'changed': {
          const { before, after } = value;
          const beforeStr = getFormattedValue(before, nextDepth);
          const afterStr = getFormattedValue(after, nextDepth);
          return (
            `${acc}${[
              `${indent}  - ${key}: ${beforeStr}`,
              `${indent}  + ${key}: ${afterStr}`,
            ].join('\n')}  \n`
          );
        }
        case 'added': {
          const innerValue = getFormattedValue(value, nextDepth);
          return `${acc}${indent}  + ${key}: ${innerValue}\n`;
        }
        case 'deleted': {
          const innerValue = getFormattedValue(value, nextDepth);
          return `${acc}${indent}  - ${key}: ${innerValue}\n`;
        }
        default:
          return `{\n${acc}}`;
      }
    }, '');
  };

  return `{\n${iter(tree, 1)}}`;
};

export default stylish;
