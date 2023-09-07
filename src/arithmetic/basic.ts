import { accAdd, accDiv, accMulti } from "../number";

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






export interface IPoint { x: number, y: number }
/** 计算两个坐标之间的距离 */
export function mathDistanceTwoPoint(p1: IPoint, p2: IPoint) {
  const dep = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  return dep;
}


