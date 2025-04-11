import geometric from "geometric";
import { IPoint, IPolygon } from "./types";

// 投线投射算法: https://en.wikipedia.org/wiki/Point_in_polygon#Ray_casting_algorithm
/** 判断 某个点 是否在多边形内部: 基于投线投射算法  */
export function polygonHasPoint(point: IPoint, polygon: IPolygon) {
  return geometric.pointInPolygon(point, polygon);
}
