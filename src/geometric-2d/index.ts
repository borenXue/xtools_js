/**
 * 一些2维几何算法库:
 * 
 * flatten-js: https://www.npmjs.com/package/@flatten-js/core
 * geometric: https://github.com/HarryStevens/geometric
 * euclid: https://github.com/mathigon/euclid.js
 * ts-geometry-2d: https://github.com/ruffythepirate/ts-geometry-2d
 * Geometrize: https://github.com/foo123/Geometrize。。。JavaScript 的计算几何和渲染库
 * CavalierContours: https://github.com/jbuckmccready/CavalierContours。。。用户偏移、组合等的2D折线库
 * 
 */

import { angleToRadian, radianToAngle } from './basic';
import { lineAngle_xAxis, lineLength, lineMidpoint, lineIntersect } from './line';
import { ellipsePointOfAngle, ellipsePointOfRadian } from './ellipse';
import { polygonHasPoint } from './polygon';

export {
  // 通用函数: 角度、弧度转换
  angleToRadian, radianToAngle,

  /**
   * 直线
   */
  lineAngle_xAxis, lineLength, lineMidpoint, lineIntersect,

  /**
   * 椭圆
   */
  ellipsePointOfAngle, ellipsePointOfRadian,


  /**
   * 多边形
   */
  polygonHasPoint,
}
