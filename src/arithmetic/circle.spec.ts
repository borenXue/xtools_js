import { use, expect } from 'chai';
import chaiAlmost from 'chai-almost';
import { mathCirclePointByRadian } from './circle';
use(chaiAlmost());

describe('圆: 根据弧度求圆上点的坐标', () => {
  /**
   * 圆心为(0,0) 半径为10: 0、90、180、270、360 的固定场景
   */
  it('圆心为(0,0) 半径为10 弧度为0 对应的点坐标为(10,0)', () => {
    expect(mathCirclePointByRadian({x:0,y:0}, 10, 0)).deep.equal({x: 10, y: 0});
  })
  it('圆心为(0,0) 半径为10 弧度为π/2 对应的点坐标为(0,10)', () => {
    expect(mathCirclePointByRadian({x:0,y:0}, 10, Math.PI/2)).deep.almost.equal({x: 0, y: 10});
  })
  it('圆心为(0,0) 半径为10 弧度为π 对应的点坐标为(-10,0)', () => {
    expect(mathCirclePointByRadian({x:0,y:0}, 10, Math.PI)).deep.almost.equal({x: -10, y: 0});
  })
  it('圆心为(0,0) 半径为10 弧度为π*1.5 对应的点坐标为(0,-10)', () => {
    expect(mathCirclePointByRadian({x:0,y:0}, 10, Math.PI*1.5)).deep.almost.equal({x: 0, y: -10});
  })
  it('圆心为(0,0) 半径为10 弧度为2π 对应的点坐标为(10,0)', () => {
    expect(mathCirclePointByRadian({x:0,y:0}, 10, Math.PI*2)).deep.almost.equal({x: 10, y: 0});
  })
})

