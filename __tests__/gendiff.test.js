import fs from 'fs';
import path from 'path';
import process from 'process';
import gendiff from '../src';

const getFixturePath = (filename) => path.resolve(process.cwd(), '__fixtures__', filename);

describe('Compare files with different formats', () => {
  const testData = [
    ['before.json', 'after.json', 'expected.stylish', 'stylish'],
    ['before.json', 'after.json', 'expected.plain', 'plain'],
    ['before.json', 'after.json', 'expected.json', 'json'],
    ['before.yml', 'after.yml', 'expected.stylish', 'stylish'],
    ['before.yml', 'after.yml', 'expected.plain', 'plain'],
    ['before.yml', 'after.yml', 'expected.json', 'json'],
  ];
  testData.forEach((itemTestData) => {
    const [beforeFileName, afterFileName, expectedFileName, format] = itemTestData;
    test(`should be same ${format}`, () => {
      const beforeFile = getFixturePath(beforeFileName);
      const afterFile = getFixturePath(afterFileName);
      const expected = fs.readFileSync(getFixturePath(expectedFileName), 'utf-8');
      const result = gendiff(beforeFile, afterFile, format);

      expect(result).toBe(expected);
    });
  });
});
