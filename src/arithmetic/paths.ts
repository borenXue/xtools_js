import { IPoint } from "./basic";

const defaultQuantity: number = 50;
const PI = Math.PI;
const PI2 = 2 * PI;

class PathCommon {
  getPoint(percent: number): IPoint { return {x:0,y:0} };

  getPoints(count: number): IPoint[] {
    if (!count || typeof count !== 'number' || count <= 0) {
      count = defaultQuantity;
    }
    if (count % 1 !== 0) {
      count = Math.round(count);
    }

    const points = []
    for (let i = 0; i < count; i++) {
      points.push(this.getPoint(i / (count - 1)))
    }

    return points
  }
}

export class PathLine extends PathCommon {
  start: IPoint;
  end: IPoint;
  setStart(_start: IPoint) { this.start = _start; }
  setEnd(_end: IPoint) { this.end = _end; }

  constructor(_start: IPoint, _end: IPoint) {
    super();
    this.start = _start;
    this.end = _end;
  }

  pathLength() {
    if (Math.hypot instanceof Function) {
      return Math.hypot(this.end.x - this.start.x, this.end.y - this.start.y);
    }
    return Math.sqrt((this.end.x - this.start.x) ** 2 + (this.end.y - this.start.y) ** 2);
  }

  /**
   * 获取路径上指定位置的点
   * 
   * 数学公式: B(t) = P0 + (P1 - P0) * t
   *
   * @param percent 点位于路径的位置，取值范围 [0,1]
   */
  getPoint(percent: number): IPoint {
    return {
      x: this.start.x + (this.end.x - this.start.x) * percent,
      y: this.start.y + (this.end.y - this.start.y) * percent,
    };
  }
}

/** 二次贝塞尔曲线路径 */
export class PathBezierTwoOrder extends PathCommon {
  start: IPoint;
  end: IPoint;
  control: IPoint;

  setStart(_start: IPoint) { this.start = _start; }
  setEnd(_end: IPoint) { this.end = _end; }
  setControl(_control: IPoint) { this.control = _control; }

  constructor(_start: IPoint, _end: IPoint, _control: IPoint) {
    super();
    this.start = _start;
    this.end = _end;
    this.control = _control;
  }

  /**
   * 获取路径上指定位置的点
   *
   * 数学公式: B(t) = (1 - t)² * P0 + 2 * t * (1 - t) * P1 + t² * P2
   *
   * @param percent 点位于路径的位置，取值范围 [0,1]
   */
  getPoint(percent: number): IPoint {
    const { x: x0, y: y0 } = this.start;
    const { x: x1, y: y1 } = this.end;
    const { x: x2, y: y2 } = this.control;
    return {
      x: Math.pow(1 - percent, 2) * x0 + 2 * percent * (1 - percent) * x1 + Math.pow(percent, 2) * x2,
      y: Math.pow(1 - percent, 2) * y0 + 2 * percent * (1 - percent) * y1 + Math.pow(percent, 2) * y2
    }
  }

  /** 获取路径中某个点的切线 */
  getPointTangent(percent: number): number { return 0 };
}

/** 三阶贝塞尔曲线路径 */
export class PathBezierThreeOrder extends PathCommon {
  start: IPoint;
  end: IPoint;
  control1: IPoint;
  control2: IPoint;

  setStart(_start: IPoint) { this.start = _start; }
  setEnd(_end: IPoint) { this.end = _end; }
  setcontrol1(_control1: IPoint) { this.control1 = _control1; }
  setcontrol2(_control2: IPoint) { this.control2 = _control2; }

  constructor(_start: IPoint, _end: IPoint, _control1: IPoint, _control2: IPoint) {
    super();
    this.start = _start;
    this.end = _end;
    this.control1 = _control1;
    this.control2 = _control2;
  }

  /**
   * 获取路径上指定位置的点
   *
   * 数学公式: B(t) = P0 * (1 - t)³ + 3 * P1 * t * (1 - t)² + 3 * P2 * t² * (1 - t) + P3 * t³
   *
   * @param percent 点位于路径的位置，取值范围 [0,1]
   */
  getPoint(percent: number): IPoint {
    const { x: x0, y: y0 } = this.start;
    const { x: x1, y: y1 } = this.control1;
    const { x: x2, y: y2 } = this.control2;
    const { x: x3, y: y3 } = this.end;
    return {
      x: x0 * Math.pow(1 - percent, 3) + 3 * x1 * percent * Math.pow(1 - percent, 2) + 3 * x2 * Math.pow(percent, 2) * (1 - percent) + x3 * Math.pow(percent, 3),
      y: y0 * Math.pow(1 - percent, 3) + 3 * y1 * percent * Math.pow(1 - percent, 2) + 3 * y2 * Math.pow(percent, 2) * (1 - percent) + y3 * Math.pow(percent, 3)
    }
  }

  /** 获取路径中某个点的切线 */
  getPointTangent(percent: number): number { return 0 };
}



/** 圆弧路径 */
export class PathArc extends PathCommon {
  center: IPoint;
  radius: number;
  startAngle: number;
  endAngle: number;
  anitclockwise: boolean;

  setCenter(_center: IPoint) { this.center = _center; }
  setRadius(_radius: number) { this.radius = _radius; }
  setStartAngle(_startAngle: number) { this.startAngle = _startAngle; }
  setEndAngle(_endAngle: number) { this.endAngle = _endAngle; }
  setAnitclockwise(_anitclockwise: boolean) { this.anitclockwise = _anitclockwise; }

  constructor(_center: IPoint, _radius: number, _startAngle: number, _endAngle: number, _anitclockwise?: boolean) {
    super();
    this.center = _center;
    this.radius = _radius;
    this.startAngle = _startAngle;
    this.endAngle = _endAngle;
    this.anitclockwise = _anitclockwise || false;
  }

  /**
   * 获取路径上指定位置的点
   *
   * @param percent 点位于路径的位置，取值范围 [0,1]
   */
  getPoint(percent: number): IPoint {
    const { radius, anitclockwise } = this;
    let { startAngle, endAngle } = this;

    if (anitclockwise) {
      // 顺时针绘制时，交换起始角和结束角
      ([startAngle, endAngle] = [endAngle, startAngle])
    }
    // 处理特殊情况
    if (endAngle - startAngle >= PI2) {
      endAngle = startAngle + PI2
    } else {
      if (startAngle !== endAngle) {
        if ((startAngle - endAngle) % PI2 === 0) {
          endAngle = startAngle
        } else {
          startAngle = startAngle % PI2
          while (endAngle > startAngle + PI2) {
            endAngle -= PI2
          }
        }
      }
    }

    // 弧的总角度值
    const angleCount = startAngle > endAngle
      ? PI2 - startAngle + endAngle
      : endAngle - startAngle

    if (anitclockwise) {
      // 反方向
      percent = 1 - percent
    }
    const degree = angleCount * percent + startAngle

    const { x, y } = this.center;
    return {
      x: x + Math.cos(degree) * radius,
      y: y + Math.sin(degree) * radius,
    }
  }

  /** 获取路径中某个点的切线 */
  getPointTangent(percent: number): number { return 0 };
}