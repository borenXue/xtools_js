import { padRight } from '../utils/index'

/**
 * Chrome 浏览器中的异常例子:
 * 
 * 1、2.24 + 2.22 = 4.460000000000001
 *    2.24 - 2.22 = 0.020000000000000018
 * 2、2.3 / 0.1 = 22.999999999999996
 *    2.3 * 0.1 = 0.22999999999999998
 * 3、-652.94 + 0.01 = -652.9300000000001
 *    -652.44 + 0.01 = -652.4300000000001
 * 4、652.94 * 100 = 65294.00000000001  ---> accAdd 与 accSub 中不可直接使用 num1*m 的方式
 *    652.44 / 100 = 65294.00000000001
 */

/**
 * 加法函数
 */
export function accAdd(num1: number = 0, num2: number = 0, ...rest: number[]): number {
  const r1Positive = num1.toString().split('.')[0] || '0';
  const r2Positive = num2.toString().split('.')[0] || '0';
  const r1Decimal = num1.toString().split('.')[1] || '';
  const r2Decimal = num2.toString().split('.')[1] || '';

  const decimalMaxCount = Math.max(r1Decimal.length, r2Decimal.length);
  const m = Math.pow(10, decimalMaxCount);

  const r1Num = +(r1Positive + padRight(r1Decimal, decimalMaxCount, '0'))
  const r2Num = +(r2Positive + padRight(r2Decimal, decimalMaxCount, '0'))

  const result = (r1Num + r2Num) / m;

  if (rest && rest.length > 0) {
    return accAdd(
      result,
      rest.shift() as number,
      ...rest,
    );
  }
  return result;
}

/**
 * 减法函数
 */
export function accSub(num1: number = 0, num2: number = 0, ...rest: number[]): number {
  const r1Positive = num1.toString().split('.')[0] || '0';
  const r2Positive = num2.toString().split('.')[0] || '0';
  const r1Decimal = num1.toString().split('.')[1] || '';
  const r2Decimal = num2.toString().split('.')[1] || '';

  const decimalMaxCount = Math.max(r1Decimal.length, r2Decimal.length);
  const m = Math.pow(10, decimalMaxCount);

  const r1Num = +(r1Positive + padRight(r1Decimal, decimalMaxCount, '0'))
  const r2Num = +(r2Positive + padRight(r2Decimal, decimalMaxCount, '0'))

  const result = (r1Num - r2Num) / m;

  if (rest && rest.length > 0) {
    return accSub(
      result,
      rest.shift() as number,
      ...rest,
    );
  }
  return result;
}

/**
 * 乘法函数
 */
export function accMulti(num1: number = 0, num2: number = 1, ...rest: number[]): number {
  let m = (num1.toString().split('.')[1] || '').length;
  m += (num2.toString().split('.')[1] || '').length;

  let result = +(String(num1).replace('.', '')) * +(String(num2).replace('.', ''));
  result /= Math.pow(10, m);

  if (rest && rest.length > 0) {
    return accMulti(
      result,
      rest.shift() as number,
      ...rest,
    );
  }
  return result;
}

/**
 * 除法函数
 */
export function accDiv(num1: number, num2: number = 1, ...rest: number[]): number {
  const r1 = (num1.toString().split('.')[1] || '').length;
  const r2 = (num2.toString().split('.')[1] || '').length;

  num1 = +(String(num1).replace('.', ''));
  num2 = +(String(num2).replace('.', ''));

  let thisResult = undefined;
  if (r2 > r1) {
    thisResult = (num1 / num2) * Math.pow(10, r2-r1);
  } else {
    thisResult = (num1 / num2) / Math.pow(10, r1-r2);
  }

  if (rest && rest.length > 0) {
    return accDiv(
      thisResult,
      rest.shift() as number,
      ...rest,
    );
  }

  return thisResult
}
