const path = require('path');
const gendiff = require('../src');

describe('first', () => {
  test('should be diff', () => {
    const filePath1 = path.resolve(__dirname, '__fixtores__/first.json');
    const filePath2 = path.resolve(__dirname, '__fixtores__/second.json');
    const result = gendiff(filePath1, filePath2);

    console.log(result);

    expect(true).toBeTruth();
  });
});
