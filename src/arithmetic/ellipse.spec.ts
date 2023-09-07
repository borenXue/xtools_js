import { use, expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { mathEllipsePointByRadian } from './ellipse';
import { mathAngleToRadian } from './basic';
use(chaiAlmost());

const radian = mathAngleToRadian(330);
console.log("xbr :", radian, mathEllipsePointByRadian({x:0,y:0}, 200, 90, radian));

describe('椭圆: 根据弧度求椭圆上点的坐标 - 圆心为(0,0) 半径为10/5', () => {
  /**
   * 圆心为(0,0) 半径为10: 0、90、180、270、360 的固定场景
   */
  it('弧度为0 对应的点坐标为(10,0)', () => {
    expect(mathEllipsePointByRadian({x:0,y:0}, 10, 5, 0)).deep.equal({x: 10, y: 0});
  })
  it('弧度为π/2 对应的点坐标为(0,5)', () => {
    expect(mathEllipsePointByRadian({x:0,y:0}, 10, 5, Math.PI/2)).deep.almost.equal({x: 0, y: 5});
  })
  it('弧度为π 对应的点坐标为(-10,0)', () => {
    expect(mathEllipsePointByRadian({x:0,y:0}, 10, 5, Math.PI)).deep.almost.equal({x: -10, y: 0});
  })
  it('弧度为π*1.5 对应的点坐标为(0,-5)', () => {
    expect(mathEllipsePointByRadian({x:0,y:0}, 10, 5, Math.PI*1.5)).deep.almost.equal({x: 0, y: -5});
  })
  it('弧度为2π 对应的点坐标为(10,0)', () => {
    expect(mathEllipsePointByRadian({x:0,y:0}, 10, 5, Math.PI*2)).deep.almost.equal({x: 10, y: 0});
  })
})

/**
 * 特定角度下的值检测: 参考 docs/ellipse.sketch 文件
 */
describe('椭圆: 根据弧度求椭圆上点的坐标 - 圆心为(0,0) 半径为200/90', () => {
  use(chaiAlmost(0.01));

  function itemIt(item) {
    it(`角度${item.angle} - (${item.x},${item.y})`, () => {
      expect(mathEllipsePointByRadian({x:0,y:0}, 200, 90, mathAngleToRadian(item.angle))).deep.almost.equal({x: item.x, y: item.y});
    })
  }

  describe('特殊角度', () => {
    const datas = [
      { angle: 0, x: 200, y: 0 },
      { angle: 90, x: 0, y: 90 },
      { angle: 180, x: -200, y: 0 },
      { angle: 270, x: 0, y: -90 },
      { angle: 360, x: 200, y: 0 },
    ];
    for (const item of datas) {
      itemIt(item);
    }
  });

  describe('第一象限', () => {
    const datas = [
      { angle: 30, x: 122.95, y: 70.99 },
      { angle: 45, x: 82.07, y: 82.07 },
      { angle: 60, x: 50.29, y: 87.11 },
    ];
    for (const item of datas) {
      itemIt(item);
    }
  });

  describe('第二象限', () => {
    const datas = [
      { angle: 120, x: -50.29, y: 87.11 },
      { angle: 135, x: -82.07, y: 82.07 },
      { angle: 150, x: -122.95, y: 70.99 },
    ];
    for (const item of datas) {
      itemIt(item);
    }
  });

  describe('第三象限', () => {
    const datas = [
      { angle: 210, x: -122.95, y: -70.99 },
      { angle: 225, x: -82.07, y: -82.07 },
      { angle: 240, x: -50.29, y: -87.11 },
    ];
    for (const item of datas) {
      itemIt(item);
    }
  });

  describe('第四象限', () => {
    const datas = [
      { angle: 300, x: 50.29, y: -87.11 },
      { angle: 315, x: 82.07, y: -82.07 },
      { angle: 330, x: 122.95, y: -70.99 },
    ];
    for (const item of datas) {
      itemIt(item);
    }
  });
})


