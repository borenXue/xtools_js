import { use, expect } from 'chai';
import chaiAlmost from 'chai-almost';
import {
  mathAngleToRadian, mathRadianToAngle,
  mathDistanceTwoPoint,
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

