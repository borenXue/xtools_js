/**
 * 身份证相关函数
 *
 * @packageDocumentation
 * @module IdCard
 * @preferred
 *
 */

/**
 *
 * [[include:idcard.md]]
 *
 */


/**
 * 加权因子
 * 
 * 1~17位的位置序号 -- 加权因子
 */
const weightingFactors: number[] = [
  7, 9, 10, 5, 8,
  4, 2, 1, 6, 3,
  7, 9, 10, 5, 8,
  4, 2,
];

/**
 * 校验码
 *
 * 余数 -- 检验码
 */
const checkCodes: string[] = [
  '1', '0', 'X', '9', '8',
  '7', '6', '5', '4', '3',
  '2',
];


/**
 * 身份证号的合法校验
 *  - 注意: 合规并不代表身份证号真实存在
 * 
 * @param idcard 身份证号
 * @returns 是否合法
 */
export function validIdCard(idcard: string): boolean {
  let str = String(idcard);
  if (str.length === 15) str = switchV1ToV1(idcard);
  if (str.length !== 18) return false;

  // 粗校验 - 正则表达式的规则
  //    1、第1位 非 0                                [1-9]
  //    2、第2~6位 为 0~9                            [0-9]{5}
  //    3、第7~10位 为年份, 所以第7、8位为 19 或 20:    (19|20)[0-9]{2}
  //    4、第11~12位 为月份, 01~12 之间                [0|1][0-9]
  //    5、第13~14位 为日期, 01~31 之间                [0|1|2|3][0-9]
  //    6、第15~17位 为顺序号, 都在 0~9 之间            [0-9]{3}
  //    7、第18位 为校验码, 0~9 之间或为 X              ([0-9]|X)
  // const roughValidRegexp = /^[1-9][0-9]{5}(19|20)[0-9]{2}[0|1][0-9][0|1|2|3][0-9][0-9]{3}([0-9]|X)$/
  const roughValidRegexp = `
    [1-9]
    [0-9]{5}
    (19|20)[0-9]{2}
    [0|1][0-9]
    [0|1|2|3][0-9]
    [0-9]{3}
    [0-9xX]
  `.replace(/\s/g, '');
  if (!new RegExp(roughValidRegexp).test(String(idcard))) return false

  // 出生日期校验
  str = String(idcard);
  const birthStr = `${str.substring(6, 10)}-${str.substring(10, 12)}-${str.substring(12, 14)}`;
  if (new Date(birthStr) < new Date('1984-04-06') || new Date(birthStr) > new Date()) return false;

  // 第二代身份证校验 - 18位
  // 计算最后一位校验码
  let result: number = 0;
  const values: string[] = str.split('');
  for (let i = 0; i < 17; i++) {
    result += weightingFactors[i] * +values[i];
  }
  // 最后一位校验码不匹配, 则判定为不合法
  if (checkCodes[result % 11] !== values[17]) return false;

  return true;
}

// 一代身份证号自动升级为第二代身份证号
function switchV1ToV1(str: string) {
  str = str.slice(0, 6) + '19' + str.slice(6);
  return str + calcCheckCode(str);
}

// 计算校验码
function calcCheckCode(str: string) {
  let result: number = 0;
  const values: string[] = str.split('');
  for (let i = 0; i < 17; i++) {
    result += weightingFactors[i] * +values[i];
  }
  return checkCodes[result % 11];
}
