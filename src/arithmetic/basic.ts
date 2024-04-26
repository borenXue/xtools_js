import { accAdd, accDiv, accMulti } from "../number";

export interface IPoint { x: number, y: number }
export interface ILine {
  point1: IPoint,
  point2: IPoint,
}

/**
 * 360角度=2π弧度
 * x角度 / 360角度 = y弧度 / 2π弧度
 */
const fullRadian = accMulti(2, Math.PI);

/** 角度angle  转化为  弧度radian */
export function mathAngleToRadian(angle: number) {
  // return (angle / 360) * 2 * Math.PI;
  return accMulti(
    accDiv(angle, 360),
    fullRadian
  )
}

/** 弧度radian  转化为  角度angle */
export function mathRadianToAngle(radian: number) {
  // return (radian / (2 * Math.PI)) * 360;
  return accMulti(
    accDiv(radian, fullRadian ),
    360,
  );
}

export interface Range {
  start: number,
  end: number,
  startClose: boolean,
  endClose: boolean,
}
/** 判断两个区间, 是否相交 */
export function isRangeIntersect(range1: Range, range2: Range) {
  if (range1.start > range1.end) throw new Error(`isRangeIntersect range1{start:${range1.start}, end:${range1.end}} 中 start > end`);
  if (range2.start > range2.end) throw new Error(`isRangeIntersect range2{start:${range2.start}, end:${range2.end}} 中 start > end`);

  // range1 在 range2 的左侧, 且不相交
  if (range1.end < range2.start) return false;
  // range1 在 range2 的右侧, 且不相交
  if (range1.start > range2.end) return false;

  // range1 在 range2 的左侧, 且相交
  if (range1.end === range2.start && (!range1.endClose || !range2.startClose)) return false;
  // range1 在 range2 的右侧, 且相交
  if (range1.start === range2.end && (!range1.startClose || !range2.endClose)) return false;

  return true;
}

/** 判断两个区间, 是否完全包含。即 一个区间完全在另一个区间的内部 */
export function isRangeCompletelyIncluded(range1: Range, range2: Range) {
  if (range1.start > range1.end) throw new Error(`isRangeCompletelyIncluded range1{start:${range1.start}, end:${range1.end}} 中 start > end`);
  if (range2.start > range2.end) throw new Error(`isRangeCompletelyIncluded range2{start:${range2.start}, end:${range2.end}} 中 start > end`);

  const [rangeSmall, rangeBig] = range1.start < range2.start ? [range1, range2] : [range2, range1];
  return isRangeCompletelyIncludedStrict(rangeSmall, rangeBig);
}
export function isRangeCompletelyIncludedStrict(rangeSmall: Range, rangeBig: Range) {
  if (rangeSmall.start > rangeSmall.end) throw new Error(`isRangeCompletelyIncludedStrict rangeSmall{start:${rangeSmall.start}, end:${rangeSmall.end}} 中 start > end`);
  if (rangeBig.start > rangeBig.end) throw new Error(`isRangeCompletelyIncludedStrict rangeBig{start:${rangeBig.start}, end:${rangeBig.end}} 中 start > end`);

  // small 起点在 big 起点 左侧
  if (rangeSmall.start < rangeBig.start) return false;
  // small 终点在 big 终点 右侧
  if (rangeSmall.end > rangeBig.end) return false;

  if (rangeSmall.start === rangeBig.start && rangeSmall.startClose && !rangeBig.startClose) return false
  if (rangeSmall.end === rangeBig.end && rangeSmall.endClose && !rangeBig.endClose) return false;

  return true;
}


/** 判断两条线段是否相交 */
export function isTwoLineIntersect(line1: ILine, line2: ILine) {
  const p1 = line1.point1;
  const p2 = line1.point2;
  const p3 = line2.point1;
  const p4 = line2.point2;

  const s1 = (p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x);
  const s2 = (p4.x - p3.x) * (p2.y - p3.y) - (p4.y - p3.y) * (p2.x - p3.x);
  const s3 = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
  const s4 = (p2.x - p1.x) * (p4.y - p1.y) - (p2.y - p1.y) * (p4.x - p1.x);
  return s1 * s2 <= 0 && s3 * s4 <= 0;
}


/**
 * 获取两个集合的交集
 * 
 * listIntersection(['a1', 'a2'], ['a2', 'a3']) => ['a2']
 */
export function listIntersection(list1: any[], list2: any[]) {
  return list1.filter(item => list2.includes(item));
}
/**
 * 获取两个集合的并集
 * 
 * listUnion(['a1', 'a2'], ['a2', 'a3']) => ['a1', 'a2', 'a3']
 */
export function listUnion(list1: any[], list2: any[]) {
  return Array.from(new Set([...list1, ...list2]));
}
/**
 * 两个集合的差集 - list1包含, 但list2不包含的元素。即 list1 - list2
 * 
 * listSubstract(['a1', 'a2'], ['a2', 'a3']) => ['a1']
 * 
 * listSubstract(['a2', 'a3'], ['a1', 'a2']) => ['a3']
 */
export function listSubstract(list1: any[], list2: any[]) {
  return list1.filter(item => !list2.includes(item));
}



/** 计算两个坐标之间的距离 */
export function mathDistanceTwoPoint(p1: IPoint, p2: IPoint) {
  const dep = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  return dep;
}


