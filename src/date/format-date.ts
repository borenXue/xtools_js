import { padLeft } from "../utils";

/**
 * 日期格式化
 * 
 * 
 * | 占位符 | 含义 | 示例 |
 * | :----- | :----: | :----: |
 * | YYYY | 年份-4位 | 2021 |
 * | YY | 年份-2位 | 21 |
 * | MM | 月份-2位 | 01、12|
 * | M | 月份-2位 | 1、12 |
 * | DD | 日期-2位 | 01、30 |
 * | D | 日期 | 1、30 |
 * | HH | 小时-2位 | 01、24 |
 * | H | 小时 | 1、24 |
 * | mm | 分钟-2位 | 01、60 |
 * | m | 分钟 | 1、60 |
 * | ss | 秒钟-2位 | 01、60 |
 * | s | 秒钟 | 1、60 |
 * | SSS | 毫秒 - 3位 | 001、023、999 |
 * | S | 毫秒 | 1、23、999 |
 * | TODO: ddd | 待开发；天数-3位 | 001、099、365 |
 * | TODO: d | 待开发；天数 | 1、99、365 |
 *
 * @param time 日期、时间、日期字符串
 * @param format 期望的格式
 */
export default function formatDate(
  time: number | string | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string {
  if (time === null || time === undefined) return '';

  const dateObj = time instanceof Date ? time : new Date(time);

  // Invalid Date 校验
  if (isNaN(dateObj.getFullYear())) return time.toString();

  const year = String(dateObj.getFullYear());
  const regexValueList = [
    // 年
    ['YYYY', padLeft(dateObj.getFullYear(), 4, '0')],
    ['YY', year.substring(year.length - 2)],
    // 月
    ['MM', padLeft(dateObj.getMonth() + 1, 2, '0')],
    ['M', padLeft(dateObj.getMonth() + 1, 1, '0')],
    // 日
    ['DD', padLeft(dateObj.getDate(), 2, '0')],
    ['D', padLeft(dateObj.getDate(), 1, '0')],
    // 时
    ['HH', padLeft(dateObj.getHours(), 2, '0')],
    ['H', padLeft(dateObj.getHours(), 1, '0')],
    // 分
    ['mm', padLeft(dateObj.getMinutes(), 2, '0')],
    ['m', padLeft(dateObj.getMinutes(), 1, '0')],
    // 秒
    ['ss', padLeft(dateObj.getSeconds(), 2, '0')],
    ['s', padLeft(dateObj.getSeconds(), 1, '0')],
    // 毫秒
    ['SSS', padLeft(dateObj.getMilliseconds(), 3, '0')],
    // ['SS', padLeft(dateObj.getMilliseconds(), 2, '0')],
    ['S', padLeft(dateObj.getMilliseconds(), 1, '0')],
    // 天数: 1~365
    // ['ddd', padLeft(dateObj.getDay(), 3, '0')],
    // ['d', padLeft(dateObj.getDay(), 1, '0')],
  ];

  let result = format
  for (const [regex, value] of regexValueList) {
    result = result.replace(new RegExp(regex, 'g'), value)
  }

  return result
}
