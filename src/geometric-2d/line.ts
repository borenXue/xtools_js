import geometric from "geometric"
import { ILine, IPoint } from "./types";
import { isTwoLineIntersect } from "../arithmetic";
/**
 * 点到直线距离
 * 
 * 两条直线: 夹角、是否相交、交点
 * 
 */

/** 计算直线长度 */
export function lineLength(line: ILine) {
  return geometric.lineLength(line);
}

/** 计算直线的中点坐标 */
export function lineMidpoint(line: ILine) {
  return geometric.lineMidpoint(line);
}

/** 计算直线与 x轴 的夹角 */
export function lineAngle_xAxis(line: ILine) {
  return geometric.lineAngle(line);
}

/** 判断 两条直线 是否相交 */
export function lineIntersect(line1: ILine, line2: ILine) {
  // return geometric.lineIntersectsLine(line1, line2);
  const [p1, p2] = line1;
  const [p3, p4] = line2;

  const newLine1 = {
    point1: { x: p1[0], y: p1[1] },
    point2: { x: p2[0], y: p2[1] },
  };
  const newLine2 = {
    point1: { x: p3[0], y: p3[1] },
    point2: { x: p4[0], y: p4[1] },
  };
  return isTwoLineIntersect(newLine1, newLine2);
}

