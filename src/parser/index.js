import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';

export default (filePath) => {
  const file = fs.readFileSync(path.resolve(filePath), 'utf8');
  const format = path.extname(filePath);
  switch (format) {
    case '.yml':
      return yaml.load(file);
    default:
      return JSON.parse(file);
  }
};
