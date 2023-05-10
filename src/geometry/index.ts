export interface XPoint2 { x: number; y: number; }

/**
 * 计算两个坐标之间的距离
 * 
 * (diffX ** 2 + diffY ** 2)  开根号
 */
export function pointDistance(p1: XPoint2, p2: XPoint2) {
  const dep = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  return dep;
}
const p2 = {x: 0, y: 0};
const p1 = {x: 10, y: 10};
Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

// export function line
