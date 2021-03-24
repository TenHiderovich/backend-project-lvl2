import fs from 'fs';
import gendiff from '../src';

const path = `${__dirname}/__fixtures__/`;

describe('first', () => {
  test('should be same', () => {
    const before = `${path}/before.json`;
    const after = `${path}/after.json`;
    const expected = fs.readFileSync(`${path}/expected.json`, 'utf-8');
    const result = gendiff(before, after);

    expect(result).toBe(JSON.parse(expected));
  });
});
