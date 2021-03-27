import _ from 'lodash';

const getIndent = (depth) => {
  const spaceCount = 4;
  return ' '.repeat(spaceCount).repeat(depth);
};

const objectToStr = (object, depth) => {
  let result = '';
  const indent = getIndent(depth);
  const entries = Object.entries(object);
  const { length: entriesCount } = entries;

  for (let i = 0; i < entriesCount; i += 1) {
    const [key, value] = entries[i];
    const newValue = _.isObject(value) ? objectToStr(value, depth + 1) : value;
    const lineBreak = (entriesCount > 1 && i !== entriesCount - 1) ? '\n' : '';

    result += `${indent}${key}: ${newValue}${lineBreak}`;
  }

  return `{\n${result}\n${getIndent(depth - 1)}}`;
};

const stylish = (tree, depth) => {
  let result = '';
  const depthStep = 1;
  const nextDepth = depth + depthStep;
  const indent = getIndent(depth - depthStep);

  for (let i = 0; i < tree.length; i += 1) {
    const item = tree[i];
    const { key, value, children } = item;
    switch (item.type) {
      case 'same': {
        const innerValue = children !== undefined
          ? stylish(children, depth + 1)
          : `${value}`;
        result += `${indent}    ${key}: ${innerValue}\n`;
        continue;
      }
      case 'changed': {
        const { before, after } = value;
        const beforeStr = _.isObject(before) ? objectToStr(before, nextDepth) : before;
        const afterStr = _.isObject(after) ? objectToStr(after, nextDepth) : after;
        result += (
          `${[
            `${indent}  - ${key}: ${beforeStr}`,
            `${indent}  + ${key}: ${afterStr}`,
          ].join('\n')  }\n`
        );
        continue;
      }
      case 'added': {
        const innerValue = _.isObject(value) ? objectToStr(value, nextDepth) : value;
        result += `${indent}  + ${key}: ${innerValue}\n`;
        continue;
      }
      case 'deleted': {
        const innerValue = _.isObject(value) ? objectToStr(value, nextDepth) : value;
        result += `${indent}  - ${key}: ${innerValue}\n`;
        continue;
      }
      default:
        return result;
    }
  }

  return `{\n${result}${indent}}`;
};

export default stylish;
