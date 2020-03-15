/**
 * 中国居民身份证号规则
 * 
 * 第一代身份证: 15位, 原名社会保障号, 1984年4月6日开始启用, 2013年1月1日起停止使用
 * 第二代身份证: 18位, 
 * 两者的差异
 *    1、出生日期: 15位中的年份只有2位, 18位中的年份只有4位
 *    2、18位中的最后一位为校验码, 15位没有校验码
 *
 * 15位: 社会保障号, 即第一代身份证
 * 18位: 1999年更名为公民身份证号, 即第二代身份证
 * 15位与18位的差异:
 *  
 *  
 * 
 * 18位身份证排序规则:
 *  地址码(6位) + 出生日期码(8位) + 数字顺序码(3位) + 数字校验码(1位)
 *  地址码: 常住户口所在县、市、区的行政区划代码, 行政区划代码按 GB/T2260 规定执行
 *  出生日期码: YYYYMMDD, 按 GB/T7408 规定执行
 *      原15位中 999、998、997、996 分配给百岁老人
 *  顺序码: 同一地址码所在区域内, 对同一天出生的人编写的顺序号, 奇数分配给男性、偶数分配给女性
 *  校验码: 通过采用 ISO 7064:1983,MOD 11-2 校验码系统计算出校验码
 *      校验码也有 X, 代表罗马字符X, 相当于10
 *
 *
 *
 * 校验码计算规则:
 *    将本体码各位数字乘以对应的加权因子并求和, 除以11得到余数, 根据余数通过校验码对照表查出校验码
 * 加权因子:
 *   位置序号  1   2   3   4   5   6   7   8   9   10   11   12   13   14   15   16   17
 *   加权因子  7   9   10  5   8   4   2   1   6   3    7    9    10   5    8    4    2
 * 校验码:
 *   余   数  0   1   2   3   4   5   6   7   8   9   10
 *   校验码   1   0   X   9   8   7   6   5   4   3   2
 *
 * 
 * 行政区划代码
 *    https://github.com/wecatch/china_regions
 *    http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/
 *    http://www.mca.gov.cn/article/sj/xzqh/1980/
 * 
 * 参考:
 *  维基百科 - 中华人民共和国居民身份证: https://zh.wikipedia.org/wiki/中华人民共和国居民身份证
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
