
export default function formatMoney(money: number, { decimal, trim }: {
  decimal?: number,
  trim?: boolean
} = {}) {
  // 确定要保留的小数位数
  let decimalFinal = typeof decimal === 'number' ? Math.max(0, decimal) : 2;
  decimalFinal = Math.round(decimalFinal);
  // 确定 trim
  const trimFinal = !!trim;

  const num = isNaN(+money) ? 0 : +money;
  const prefix = num < 0 ? '-' : '';

  // 根据目标小数位, 进行四舍五入, 并按需自动填充 0
  let str = String(Math.round(Math.abs(num) * Math.pow(10, decimalFinal)) / Math.pow(10, decimalFinal));
  if (str.indexOf('.') === 0) str = '0' + str;
  if (str.indexOf('.') < 0) str += `.${makeZero(decimalFinal)}`;
  const tempCurrentDecimalLength = str.length - str.indexOf('.') - 1;
  if (str.indexOf('.') > 0 && tempCurrentDecimalLength < decimalFinal) str += makeZero(decimalFinal - tempCurrentDecimalLength);

  let suffix = str.substring(str.indexOf('.'));
  suffix = suffix === '.' ? '' : suffix;
  str = str.substring(0, str.indexOf('.')).replace(/^-/, '');

  let result = '';
  while (str.length > 3) {
    result = `,${str.substring(str.length - 3, str.length)}${result}`;
    str = str.substring(0, str.length - 3);
  }

  // 处理 trimFinal
  if (trimFinal) {
    suffix = suffix.replace(/0{1,}$/, '').replace(/\.$/, '');
  }

  return `${prefix}${str}${result}${suffix}`;
}

function makeZero(count: number) {
  if (count <= 0) return '';
  const num = Math.pow(10, count);
  return String(num).substring(1);
}
