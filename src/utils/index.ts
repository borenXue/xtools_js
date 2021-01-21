
/**
 * 字符串左侧按需动态填充
 *
 * @param origin 原字符串
 * @param digit 期望最终的字符串长度, 如果原字符串>=digit, 则不做任何处理直接返回
 * @param holder 用来填充的字符, 默认为空格
 * 
 * @returns 最终生成的字符串
 */
export function padLeft(origin: string | number, digit: number, holder: string = ' ') {
  const str = typeof origin === 'string' ? origin : origin.toString()

  if (str.length >= digit) return str;

  let prefix = '';
  for (let i = 0; i < digit - str.length; i++) {
    prefix += holder
  }

  return `${prefix}${str}`;
}

/**
 * 字符串右侧按需动态填充
 *
 * @param origin 原字符串
 * @param digit 期望最终的字符串长度, 如果原字符串>=digit, 则不做任何处理直接返回
 * @param holder 用来填充的字符, 默认为空格
 * 
 * @returns 最终生成的字符串
 */
export function padRight(origin: string | number, digit: number, holder: string = ' ') {
  const str = typeof origin === 'string' ? origin : origin.toString()

  if (str.length >= digit) return str;

  let suffix = '';
  for (let i = 0; i < digit - str.length; i++) {
    suffix += holder
  }

  return `${str}${suffix}`;
}

/** @hidden */
export type IsType<T> = (val: any) => val is T;
