import { use, expect } from 'chai';
import chaiAlmost from 'chai-almost';
import {
  mathAngleToRadian, mathRadianToAngle,
  mathDistanceTwoPoint,
  isTwoLineIntersect,
  ILine,
} from './basic';

/**
 * 角度、弧度在线转换工具: https://www.osgeo.cn/app/sc210
 * 两点距离计算器: https://www.99cankao.com/analytical/distance.php
 */

use(chaiAlmost());



const datas = [
  { angle: 0, radian: 0 },
  { angle: 45, radian: Math.PI/4, radianDesc: 'π/4' },
  { angle: 90, radian: Math.PI/2, radianDesc: 'π/2' },
  { angle: 135, radian: Math.PI*(3/4), radianDesc: 'π*(3/4)' },
  { angle: 180, radian: Math.PI, radianDesc: 'π' },
  { angle: 225, radian: Math.PI*1.25, radianDesc: 'π*1.25' },
  { angle: 270, radian: Math.PI*1.5, radianDesc: 'π*1.5' },
  { angle: 315, radian: Math.PI*1.75, radianDesc: 'π*1.75' },
  { angle: 360, radian: Math.PI*2, radianDesc: 'π*2' },
  // 随机值
  { angle: 57.29577951308232, radian: 1 },
  { angle: 114.59155902616465, radian: 2 },
];


describe('basic: 弧度转化为角度', () => {
  for (const item of datas) {
    it(`${item.radianDesc || item.radian}弧度 = ${item.angle}角度`, () => {
      expect(mathRadianToAngle(item.radian)).to.almost.equal(item.angle);
    })
  }
})


describe('basic: 角度转化为弧度', () => {
  for (const item of datas) {
    it(`${item.angle}角度 = ${item.radianDesc || item.radian}弧度`, () => {
      expect(mathAngleToRadian(item.angle)).to.almost.equal(item.radian);
    })
  }
})

describe('basic: 两点之间距离', () => {
  it('(1,2) 与 (1,2) 距离 = 0', () => {
    expect(mathDistanceTwoPoint({x:1,y:2},{x:1,y:2})).to.almost.equal(0);
  })

  it('(1,1) 与 (6,6) 距离 = 7.0710678118654755', () => {
    expect(mathDistanceTwoPoint({x:1,y:1},{x:6,y:6})).to.almost.equal(7.0710678118654755);
  })

  it('(-14,-34) 与 (6,6) 距离 = 44.721359549995796', () => {
    expect(mathDistanceTwoPoint({x:-14,y:-34},{x:6,y:6})).to.almost.equal(44.721359549995796);
  })
})

describe('basic: 两条线段是否相交', () => {
  const lines: {[key:string]: ILine} = {
    x0: { point1: {x:0,y:0}, point2: {x:10,y:0} }, // x 轴
    y0: { point1: {x:0,y:0}, point2: {x:0,y:10} }, // y 轴
    x1: { point1: {x:1,y:0}, point2: {x:10,y:0} }, // x 轴

    // 两条平行线
    bias0: { point1: {x:0,y:0}, point2: {x:10,y:10} }, // 斜线
    bias1: { point1: {x:1,y:0}, point2: {x:11,y:10} }, // 斜线

    // 两条相交的斜线
    bias2: { point1: {x:0,y:0}, point2: {x:10,y:10} }, // 斜线
    bias3: { point1: {x:0,y:10}, point2: {x:10,y:0} }, // 斜线
  };
  it('x轴线、y轴线 起点都是原点', () => {
    expect(isTwoLineIntersect(lines.x0, lines.y0))
      .to.almost.equal(true);
  })
  it('完全相同的两条线段', () => {
    expect(isTwoLineIntersect(lines.x0, lines.y0))
      .to.almost.equal(true);
  })
  it('两条相交的斜线', () => {
    expect(isTwoLineIntersect(lines.bias2, lines.bias3))
      .to.almost.equal(true);
  })

  it('两条平行线', () => {
    expect(isTwoLineIntersect(lines.bias0, lines.bias1))
      .to.almost.equal(false);
  })
  it('两条线段 相互垂直, 但不相交', () => {
    expect(isTwoLineIntersect(lines.x1, lines.y0))
      .to.almost.equal(false);
  })
})

