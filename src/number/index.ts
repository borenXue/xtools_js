
/**
 * 加法函数
 */
export function accAdd(num1: number = 0, num2: number = 0, ...rest: number[]): number {
  const r1 = (num1.toString().split('.')[1] || '').length;
  const r2 = (num2.toString().split('.')[1] || '').length;
  const m = Math.pow(10, Math.max(r1, r2));

  if (rest && rest.length > 0) {
    return accAdd(
      (num1 * m + num2 * m) / m,
      rest.shift() as number,
      ...rest,
    );
  }
  return (num1 * m + num2 * m) / m;
}

/**
 * 减法函数
 */
export function accSub(num1: number = 0, num2: number = 0, ...rest: number[]): number {
  // const r1 = (num1.toString().split('.')[1] || '').length;
  // const r2 = (num2.toString().split('.')[1] || '').length;
  // const rMax = Math.max(r1, r2);
  // const m = Math.pow(10, rMax);

  // num1 = +(String(num1).replace('.', '')) * Math.pow(10, rMax - r1);
  // num2 = +(String(num2).replace('.', '')) * Math.pow(10, rMax - r2);

  // if (rest && rest.length > 0) {
  //   return accSub(
  //     (num1 - num2) / m,
  //     rest.shift() as number,
  //     ...rest,
  //   );
  // }

  // return (num1 - num2) / m;

  const r1 = (num1.toString().split('.')[1] || '').length;
  const r2 = (num2.toString().split('.')[1] || '').length;
  const m = Math.pow(10, Math.max(r1, r2));

  if (rest && rest.length > 0) {
    return accSub(
      (num1 * m - num2 * m) / m,
      rest.shift() as number,
      ...rest,
    );
  }
  return (num1 * m - num2 * m) / m;
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
