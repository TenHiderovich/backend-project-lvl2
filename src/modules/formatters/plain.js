import _ from 'lodash';

const withQuote = (value) => (typeof value === 'string' ? `'${value}'` : value);

const complexValue = (value) => (_.isObject(value) ? '[complex value]' : withQuote(value));

const plain = (tree) => {
  const iter = (innerTree, prevKey) => innerTree.reduce((acc, node) => {
    const {
      type, key, value, children,
    } = node;

    if (children !== undefined) {
      return `${acc}${iter(children, key)}`;
    }

    const dot = prevKey.length === 0 ? '' : '.';

    switch (type) {
      case 'changed': {
        const before = complexValue(value.before);
        const after = complexValue(value.after);
        return `${acc}Property '${prevKey}${dot}${key}' was updated. From ${before} to ${after}\n`;
      }
      case 'added': {
        return `${acc}Property '${prevKey}${dot}${key}' was added with value: ${complexValue(value)}\n`;
      }
      case 'deleted': {
        return `${acc}Property '${prevKey}${dot}${key}' was removed\n`;
      }
      default:
        return acc;
    }
  }, '');

  return iter(tree, '');
};

export default plain;
