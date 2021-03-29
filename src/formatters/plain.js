import _ from 'lodash';

const withQuote = (value) => (typeof value === 'string' ? `'${value}'` : value);

const complexValue = (value) => (_.isObject(value) ? '[complex value]' : withQuote(value));

const plain = (tree) => {
  const iter = (innerTree, path) => innerTree.reduce((acc, node) => {
    const {
      type, key, value, children,
    } = node;

    const dot = path.length === 0 ? '' : '.';

    const complexPath = `${path}${dot}${key}`;

    if (children !== undefined) {
      return `${acc}${iter(children, complexPath)}`;
    }

    switch (type) {
      case 'changed': {
        const before = complexValue(value.before);
        const after = complexValue(value.after);
        return `${acc}Property '${complexPath}' was updated. From ${before} to ${after}\n`;
      }
      case 'added': {
        return `${acc}Property '${complexPath}' was added with value: ${complexValue(value)}\n`;
      }
      case 'deleted': {
        return `${acc}Property '${complexPath}' was removed\n`;
      }
      default:
        return acc;
    }
  }, '');

  return iter(tree, '').trimRight();
};

export default plain;
