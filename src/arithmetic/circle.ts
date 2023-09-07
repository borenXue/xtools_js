import { IPoint } from "./basic";

/** 根据角度求圆上的点坐标 */
export function mathCirclePointByRadian(centerPoint: IPoint, radius: number, radian: number) {
  const x = centerPoint.x + radius * Math.cos(radian);
  const y = centerPoint.y + radius * Math.sin(radian);
  return { x, y };
}

