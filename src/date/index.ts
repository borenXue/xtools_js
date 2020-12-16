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
    ? new Date(`${end.getFullYear() + 1}/01/01 00:00:00`)
    : new Date(`${end.getFullYear()}/${end.getMonth() + 2}/01 00:00:00`);
  // 得到 endTime 所在月份最后一毫秒
  end = new Date(end.getTime() - 1);

  return [
    new Date(formatDate(startTime, 'YYYY/MM/01 00:00:00')).getTime(),
    end.getTime(),
  ];
}

export function timeMonthStart(time: number | Date | string) {
  let start = new Date(time);
  return new Date(`${start.getFullYear()}/${start.getMonth() + 1}/01 00:00:00`).getTime();
}

export function timeMonthEnd(time: number | Date | string) {
  let end = new Date(time)
  end = end.getMonth() === 11
    ? new Date(`${end.getFullYear() + 1}/01/01 00:00:00`)
    : new Date(`${end.getFullYear()}/${end.getMonth() + 2}/01 00:00:00`) ;
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

  const end = new Date(formatDate(endTime, 'YYYY/MM/DD 23:59:59'));

  return [
    new Date(formatDate(startTime, 'YYYY/MM/DD 00:00:00')).getTime(),
    +String(end.getTime()).replace(/000$/, '999'),
  ];
}


export function timeDayStart(day: number | Date | string,) {
  return new Date(formatDate(day, 'YYYY/MM/DD 00:00:00')).getTime();
}

export function timeDayEnd(day: number | Date | string,) {
  const todayZero = new Date(formatDate(day, 'YYYY/MM/DD 00:00:00'));
  const tomorrowZero = todayZero.getTime() + 24 * 60 * 60 * 1000;
  return tomorrowZero - 1;
}

/**
 * 获取指定时间或当前时间的上个月同一时间
 * @param start Date 对象
 */
export function timeLastMonth(start: number | Date | string = new Date()) {
  const startDate = start ? new Date(start) : new Date();

  const year = startDate.getFullYear();
  const mon = startDate.getMonth() + 1;
  if (mon === 1) {
    return new Date(`${year - 1}/12/${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}.${startDate.getMilliseconds()}`)
  } else {
    return new Date(`${year}/${mon - 1}/${startDate.getDate()} ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}.${startDate.getMilliseconds()}`)
  }
}

/**
 * 两个时间是否超过1个月
 */
export function timeIsBetweenMonth(time1: number | Date | string, time2: number | Date | string) {
  if (!time1 || !time2) throw new Error('参数错误, 两个时间都必传');

  let startTime = new Date(time1).getTime();
  let endTime = new Date(time2).getTime();
  if (startTime > endTime) {
    [startTime, endTime] = [endTime, startTime];
  }

  const lastMonthTime = timeLastMonth(endTime).getTime();
  return startTime >= lastMonthTime;
}

