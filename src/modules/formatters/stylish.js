import _ from 'lodash';

const getIndent = (depth) => {
  const spaceCount = 4;
  return ' '.repeat(spaceCount).repeat(depth);
};

const objectToStr = (object, depth) => {
  let result = '';
  const depthStep = 1;
  const nextDepth = depth + depthStep;
  const indent = getIndent(depth);
  const entries = Object.entries(object);
  const { length: entriesCount } = entries;

  for (let i = 0; i < entriesCount; i += 1) {
    const [key, value] = entries[i];
    const newValue = _.isObject(value) ? objectToStr(value, nextDepth) : value;
    const lineBreak = (entriesCount > 1 && i !== entriesCount - 1) ? '\n' : '';

    result += `${indent}${key}: ${newValue}${lineBreak}`;
  }

  return `{\n${result}\n${getIndent(depth - depthStep)}}`;
};

const getFormattedValue = (value, depth) => (_.isObject(value) ? objectToStr(value, depth) : value);

const stylish = (tree, depth = 1) => {
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
        break;
      }
      case 'changed': {
        const { before, after } = value;
        const beforeStr = getFormattedValue(before, nextDepth);
        const afterStr = getFormattedValue(after, nextDepth);
        result += (
          `${[
            `${indent}  - ${key}: ${beforeStr}`,
            `${indent}  + ${key}: ${afterStr}`,
          ].join('\n')}  \n`
        );
        break;
      }
      case 'added': {
        const innerValue = getFormattedValue(value, nextDepth);
        result += `${indent}  + ${key}: ${innerValue}\n`;
        break;
      }
      case 'deleted': {
        const innerValue = getFormattedValue(value, nextDepth);
        result += `${indent}  - ${key}: ${innerValue}\n`;
        break;
      }
      default:
        return `{${result}}`;
    }
  }

  return `{\n${result}${indent}}`;
};

export default stylish;
