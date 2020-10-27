import formatDate from "./format-date";

/**
 * 获得两个月份之间的开始毫秒与结束毫秒的时间戳
 *
 * @param startTime 开始月份中的任意一个时刻
 * @param endTime 结束月份中的任意一个时刻
 * @returns [start, end] 时间戳数组 - start: 开始月份的第0毫秒, end: 结束月份的最后一毫秒
 */
export function timeBetweenMonth(
  startTime: number | Date | string,
  endTime: number | Date | string,
): [number, number] {
  // 确保 startTime < endTime
  if (new Date(startTime) > new Date(endTime)) {
    [startTime, endTime] = [endTime, startTime];
  }

  let end = new Date(endTime);
  // 得到 endTime 所在月份的下个月的第一毫秒的 Date 对象
  end = end.getMonth() === 11
    ? new Date(`${end.getFullYear() + 1}-01-01 00:00:00`)
    : new Date(`${end.getFullYear()}-${end.getMonth() + 2}-01 00:00:00`);
  // 得到 endTime 所在月份最后一毫秒
  end = new Date(end.getTime() - 1);

  return [
    new Date(formatDate(startTime, 'YYYY-MM-01 00:00:00')).getTime(),
    end.getTime(),
  ];
}

export function timeMonthStart(time: number | Date | string) {
  let start = new Date(time);
  return new Date(`${start.getFullYear()}-${start.getMonth() + 1}-01 00:00:00`).getTime();
}

export function timeMonthEnd(time: number | Date | string) {
  let end = new Date(time)
  end = end.getMonth() === 11
    ? new Date(`${end.getFullYear() + 1}-01-01 00:00:00`)
    : new Date(`${end.getFullYear()}-${end.getMonth() + 2}-01 00:00:00`) ;
  return end.getTime() - 1;
}


/**
 * 获得某两天之间的开始毫秒与结束毫秒的时间戳
 *
 * @param startTime 开始月份中的任意一个时刻
 * @param endTime 结束月份中的任意一个时刻
 * @returns [start, end] 时间戳数组 - start: 开始月份的第0毫秒, end: 结束月份的最后一毫秒
 */
export function timeBetweenDay(
  startTime: number | Date | string,
  endTime: number | Date | string,
): [number, number] {
  // 确保 startTime < endTime
  if (new Date(startTime) > new Date(endTime)) {
    [startTime, endTime] = [endTime, startTime];
  }

  const end = new Date(formatDate(endTime, 'YYYY-MM-DD 23:59:59'));

  return [
    new Date(formatDate(startTime, 'YYYY-MM-DD 00:00:00')).getTime(),
    +String(end.getTime()).replace(/000$/, '999'),
  ];
}


export function timeDayStart(day: number | Date | string,) {
  return new Date(formatDate(day, 'YYYY-MM-DD 00:00:00')).getTime();
}

export function timeDayEnd(day: number | Date | string,) {
  const todayZero = new Date(formatDate(day, 'YYYY-MM-DD 00:00:00'));
  const tomorrowZero = todayZero.getTime() + 24 * 60 * 60 * 1000;
  return tomorrowZero - 1;
}
