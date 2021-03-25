import fs from 'fs';
import path from 'path';
import gendiff from '../src';

const getFixturePath = (filename) => path.resolve(__dirname, '__fixtures__', filename);

describe('first', () => {
  test('should be same', () => {
    const before = getFixturePath('before.json');
    const after = getFixturePath('after.json');
    const expected = fs.readFileSync(getFixturePath('expected.json'), 'utf-8');
    const result = gendiff(before, after);

    expect(result).toBe(JSON.parse(expected));
  });
});
