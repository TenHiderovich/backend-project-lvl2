import _ from 'lodash';
import stylish from './stylish';
import plain from './plain';

const formatters = {
  stylish,
  plain,
  json: JSON.stringify,
};

export default (tree, format) => {
  if (!_.has(formatters, format)) {
    throw new Error(`Not found format: ${format}`);
  } else {
    return formatters[format](tree);
  }
};
