import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';

export default (filePath) => {
  const file = fs.readFileSync(path.resolve(filePath), 'utf8');
  const format = path.extname(filePath);
  switch (format) {
    case '.yml':
      return yaml.load(file);
    case '.json':
      return JSON.parse(file);
    default:
      throw new Error(`Format ${format} not found`);
  }
};
