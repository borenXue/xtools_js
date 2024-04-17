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




/** 计算两个坐标之间的距离 */
export function mathDistanceTwoPoint(p1: IPoint, p2: IPoint) {
  const dep = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  return dep;
}


