import _ from 'lodash';
import stylish from '../formatters/stylish';

const formatters = {
  stylish,
  json: JSON.stringify,
};

export default (tree, format) => {
  if (!_.has(formatters, format)) {
    throw new Error(`Not found format: ${format}`);
  } else {
    return formatters[format](tree, 1);
  }
};
