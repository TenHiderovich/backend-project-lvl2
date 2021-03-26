const stylish = (tree) => {
  // let space = '  ';
  // const depth = 1;
  const result = tree.reduce((acc, item) => {
    const {
      key,
      value,
      children,
    } = item;
    switch (item.type) {
      case 'same': {
        const innerValue = children !== undefined ? stylish(children) : `${value}`;
        return `${acc}    ${key}: ${innerValue}\n`;
      }
      case 'deleted': {
        const innerValue = JSON.stringify(value, null, 2);
        return `${acc}  - ${key}: ${innerValue}\n`;
      }
      case 'changed': {
        const {
          before,
          after,
        } = value;
        const beforeStr = JSON.stringify(before, null, 2);
        const afterStr = JSON.stringify(after, null, 2);
        return `${acc}  - ${key}: ${beforeStr}\n  + ${key}: ${afterStr}\n`;
      }
      case 'added': {
        const innerValue = JSON.stringify(value, null, 2);
        return `${acc}  + ${key}: ${innerValue}\n`;
      }
      default:
        return acc;
    }
  }, '');
  return `{\n${result}}`;
};

export default stylish;
