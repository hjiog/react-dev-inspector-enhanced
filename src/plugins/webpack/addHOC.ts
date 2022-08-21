import fsExtra from 'fs-extra';
import pc from 'picocolors';

export const transfer = (params: {
  text: string;
  lineNumber: number;
  colNumber: number;
  componentName: string;
  importCode: string;
}) => {
  const { text, colNumber, lineNumber, componentName, importCode } = params;
  const splits = text.split('\n');
  const preText = splits
    .slice(0, lineNumber - 1)
    .concat(new Array(colNumber).fill(' ').join(''))
    .join('\n');
  const targetText = splits
    .slice(lineNumber - 1)
    .join('\n')
    .slice(colNumber);

  // 已经存在HOC组件，则不往下执行
  if (targetText.match(new RegExp(`<${componentName}\s?>`))) {
    console.info(pc.yellow('should not add HOC once again~'));
    return false;
  }
  const newText = targetText.replace(
    /((?:<(\w+?)\s?[\w\W]*?>[\w\W]*?<\/\2>)|(?:<(\w+?)\s?[\w\W]*?\/>))/,
    `<${componentName}>$1</${componentName}>`,
  );
  let res = '';
  // 已经导入过的组件无需重复导入
  const regex = new RegExp(`^${importCode}`, 'm');
  if (preText.match(regex)) {
    res = preText + newText;
  } else {
    res = importCode + '\n' + preText + newText;
  }
  return res;
};

export const addHOC = async (params: {
  componentName: string;
  importCode: string;
  lineNumber: number;
  colNumber: number;
  absolutePath: string;
}) => {
  // console.log(params, 'params========');
  const { absolutePath } = params;
  // console.log(absolutePath);
  try {
    const text = fsExtra.readFileSync(absolutePath).toString();
    const res = transfer({ text, ...params });
    if (res) {
      fsExtra.writeFileSync(absolutePath, res);
    }
  } catch (e) {
    console.error(e);
  }
};
