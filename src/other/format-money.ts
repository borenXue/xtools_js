
export default function formatMoney(money: number) {
  const num = isNaN(+money) ? 0 : +money;
  const prefix = num < 0 ? '-' : '';
  let str = String(Math.round(Math.abs(num) * 100) / 100);
  if (str.indexOf('.') === 0) str = '0' + str;
  if (str.indexOf('.') < 0) str += '.00';
  if (str.indexOf('.') === (str.length - 2)) str += '0'

  const suffix = str.substring(str.indexOf('.'));
  str = str.substring(0, str.indexOf('.')).replace(/^-/, '');

  let result = '';
  while (str.length > 3) {
    result = `,${str.substring(str.length - 3, str.length)}${result}`;
    str = str.substring(0, str.length - 3);
  }

  return `${prefix}${str}${result}${suffix}`;
}
