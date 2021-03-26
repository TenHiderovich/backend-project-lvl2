import fs from 'fs';
import path from 'path';
import process from 'process';
import gendiff from '../src';

const getFixturePath = (filename) => path.resolve(process.cwd(), '__fixtures__', filename);

describe('Compare files with different formats', () => {
  const formats = ['json', 'yml'];
  formats.forEach((format) => {
    test(`should be same ${format}`, () => {
      const before = getFixturePath(`before.${format}`);
      const after = getFixturePath(`after.${format}`);
      const expected = fs.readFileSync(getFixturePath('expected.json'), 'utf-8');
      const result = gendiff(before, after);

      expect(JSON.stringify(result)).toBe(expected);
    });
  });
});
